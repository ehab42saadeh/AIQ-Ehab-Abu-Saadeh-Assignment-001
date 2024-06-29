const sequelize = require('../database'); // Adjust the path as per your project structure
const { Sequelize } = require('sequelize');
const Plnt21 = require('../models/plnt21Models');
const Ba21 = require('../models/Ba21Models');


module.exports = {
    getTopNByAnnualNetGeneration: async ({ number }) => {
        try {
            // Validate number
            if (!Number.isInteger(number) || number <= 0 ) {
                return {
                    success: false,
                    result: `Invalid number parameter. It must be a positive integer .`
                };
            }
            const topNRecords = await Plnt21.findAll({
                order: [['PLNGENAN', 'DESC']], // Sort by annual net generation in descending order
                limit: number, // Limit the number of results to N
            });
            return { success: true, result: topNRecords };
        } catch (err) {
            console.error('Error fetching top N records:', err);
            return { success: false, result: err };
        }
    },
    searchPlantsByState: async (stateAbbreviation, pageSize, pageIndex) => {
        try {
           // Validate state abbreviation
            if (typeof stateAbbreviation !== 'string' || stateAbbreviation.trim() === '') 
            {
                return { success: false, result: "Invalid state abbreviation. It must be a non-empty string." };
            }

            const stateAbbreviationPattern = /^[A-Z]{2}$/;
            if (!stateAbbreviationPattern.test(stateAbbreviation)) 
            {
                return { success: false, result: "Invalid state abbreviation format. It must be a two-letter uppercase string." };
            }

            // Validate page size
            if (!Number.isInteger(pageSize) || pageSize <= 0) 
            {
                return { success: false, result: "Invalid page size. It must be a positive integer." };
            }
            const maxPageSize = 15;
            if (pageSize > maxPageSize) {
                return { success: false, result: `Invalid page size. It must be less than or equal to ${maxPageSize}.` };
            }

            // Validate page index
            if (!Number.isInteger(pageIndex) || pageIndex < 0) {
                return { success: false, result: "Invalid page index. It must be a non-negative integer." };
            }

            const offset = pageIndex * pageSize;
            const plants = await Plnt21.findAll({
                where: {
                    PSTATABB: stateAbbreviation
                },
                limit: pageSize,
                offset: offset
            });
    
            if (plants.length === 0) {
                return { success: false, result: "No plants found for the given state abbreviation." };
            } else {
                return { success: true, result: plants };
            }
        } catch(err) {
            return { success: false, result: err.message }; // Assuming error message is returned on failure
        }
    },    
    getStates : async (email, data) => {
        try {
            const statesData  = await Plnt21.findAll({
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('PSTATABB')), 'PSTATABB']
                ],
                raw: true,
            });

            const states = statesData.map(state => state.PSTATABB);
            return { success: true, result: states };
        } catch(err) {
            return { success: false, result: err };
        }
    }
}
