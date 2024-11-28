"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateLast12MothsData = void 0;
async function generateLast12MothsData(model) {
    const last12Months = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
        const count = await model.countDocuments({
            createdAt: {
                $gte: startDate,
                $lt: endDate,
            },
        });
        const monthYear = startDate.toLocaleString("default", {
            month: "short",
            year: "numeric",
        });
        last12Months.unshift({ month: monthYear, count });
    }
    return { last12Months };
}
exports.generateLast12MothsData = generateLast12MothsData;
