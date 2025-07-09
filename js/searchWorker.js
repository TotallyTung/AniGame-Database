onmessage = (e) => {
    let [cardDatabase, query, talentsData] = e.data;
    let filteredCards = cardDatabase.filter(card => {
        const matchStr = (card.name + " " + card.series + " " + " " + card.talent).toLowerCase();
        const keywords = query.split(/(?=\s#)/g).filter(w => w.trimLeft()[0] !== "#")[0];
        const attributeMatch = query.match(/(?<=#)(.*?)(?=\s#|$)/g);
        const cardMatch = (keywords ? keywords.split(" ").some(k => matchStr.includes(k)) : false) ||
            (attributeMatch && attributeMatch.map(s=>s.split(/ (.+)/)).every(attribute_query => {
                const [attr, val] = attribute_query.map(s => s.toLowerCase());
                switch(attr){
                    case "ele":
                    case "element":
                        attr = "type";
                        break;

                    case "tal":
                        attr = "talent";
                        break;

                    case "talent_description":
                    case "tal_desc":
                    case "tal_description":
                    case "t_desc":
                        attr = "talent_desc";
                        break;
                }
                return (card.location && ((attr === "location" && card.location.value == val) || (attr === "floor" && card.location.floor.includes(Number(val))))) ||
                        (card[attr] && (typeof card[attr] !== "object") && String(card[attr]).toLowerCase().includes(val)) ||
                        (card.stats[attr] && String(card.stats[attr]).includes(val)) ||
                        (attr === "talent_desc" && talentsData[card.talent].find(e => e[1].includes(card.name))[0].toLowerCase().includes(val))
            }));
                
        return cardMatch;
    });
    postMessage(filteredCards);
}