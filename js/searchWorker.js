onmessage = (filteredCards, query) => {
    filteredCards = cardDatabase.filter(card => {
        const matchStr = (card.name + " " + card.series + " " + " " + card.talent).toLowerCase();
        const keywords = query.split(/(?=\s#)/g).filter(w => w.trimLeft()[0] !== "#")[0]
        const attributeMatch = query.match(/(?<=#)(.*?)(?=\s#|$)/g);
        const cardMatch = (keywords ? keywords.split(" ").some(k => matchStr.includes(k)) : false) ||
            (attributeMatch && attributeMatch.map(s=>s.split(/ (.+)/)).some(attribute_query => {
                const [attr, val] = attribute_query;
                return (card.location && ((attr === "location" && card.location.value == val) || (attr === "floor" && card.location.floor.includes(Number(val))))) ||
                        (card[attr] && (typeof card[attr] !== "object") && String(card[attr]).toLowerCase().includes(val)) ||
                        (card.stats[attr] && String(card.stats[attr]).includes(val))
            }));
                
        return cardMatch;
    });
    postMessage(filteredCards);
}