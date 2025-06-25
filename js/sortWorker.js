function evaluateFormula(formula, stats) {
    // Replace stat names with actual values
    let expression = formula.toLowerCase()
        .replace(/hp/g, stats.hp)
        .replace(/atk/g, stats.atk)
        .replace(/def/g, stats.def)
        .replace(/spd/g, stats.spd);
            
    // Security check: only allow numbers, operators, parentheses, and whitespace
    if (!/^[\d+\-*/%().\s]+$/.test(expression)) {
        throw new Error('Invalid characters in formula');
    }
            
    // Evaluate the mathematical expression
    try {
        return Function('"use strict"; return (' + expression + ')')();
    } catch (error) {
        throw new Error('Invalid formula: ' + error.message);
    }
}

onmessage = (e) => {
    let [filteredCards, currentDirection] = e.data;
    filteredCards.sort((a, b) => {
        let comparison = 0;
                
        switch(currentSort) {
            case 'id':
                comparison = parseInt(a.id) - parseInt(b.id);
                break;
            case 'name':
                comparison = a.name.localeCompare(b.name);
                break;
            case 'series':
                const seriesA = a.series || '';
                const seriesB = b.series || '';
                comparison = seriesA.localeCompare(seriesB);
                break;
            case 'type':
                comparison = a.type.localeCompare(b.type);
                break;
            case 'location':
                let locationA = '';
                let locationB = '';
                        
                if (a.location && a.location.value) locationA = a.location.value.toString();
                        
                if (b.location && b.location.value) locationB = b.location.value.toString();
                        
                comparison = locationA.localeCompare(locationB);
                break;
            case 'talent':
                const talentA = a.talent || '';
                const talentB = b.talent || '';
                comparison = talentA.localeCompare(talentB);
                break;
            case 'hp':
            case 'atk':
            case 'def':
            case 'spd':
                comparison = a.stats[currentSort] - b.stats[currentSort];
                break;
            case 'total':
                const totalA = a.stats.hp + a.stats.atk + a.stats.def + a.stats.spd;
                const totalB = b.stats.hp + b.stats.atk + b.stats.def + b.stats.spd;
                comparison = totalA - totalB;
                break;
            case 'custom':
                if (!customFormula) return 0;
                        
                try {
                    const valueA = evaluateFormula(customFormula, a.stats);
                    const valueB = evaluateFormula(customFormula, b.stats);
                    comparison = valueA - valueB;
                } catch (error) {
                    console.error('Error evaluating custom formula:', error);
                    return 0;
                }
                break;
            default:
                comparison = 0;
        }
                
        // Apply sort direction
        return currentDirection === 'desc' ? -comparison : comparison;
    });
    postMessage(filteredCards);
}