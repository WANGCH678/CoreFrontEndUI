const rawData = [
    'pariatur adipisicing',
    'dolore in ipsum ut culpa non',
    'officia id dolor',
    'culpa dolore reprehenderit',
    'consequat nulla cillum non',
];

const data = Array.from({ length: 50 }, (_, index) => ({
    id: `${index + 1}`,
    text: rawData[index % 5],
}));

export default data;
