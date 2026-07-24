const data = Array.from({ length: 60 }, (_, index) => ({
    index,
    id: `scroll-spy-${index}`,
    title: [
        'Aliqua nisi officia laboris dolor cillum id ullamco cillum enim anim ex.',
        'Voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        'Duis aute irure dolor in reprehenderit in voluptate velit esse.',
        'Excepteur sint occaecat cupidatat non proident sunt in culpa.',
        'Lorem ipsum dolor sit amet consectetur adipiscing elit.',
    ][index % 5],
    description: [
        'Est adipisicing ea pariatur ad id culpa quis ipsum. Culpa nostrud mollit irure eiusmod ea voluptate laborum. Tempor duis enim incididunt velit est ullamco.',
        'Nostrud elit sint voluptate anim laborum excepteur. Aliquip ex ad reprehenderit consectetur dolore velit fugiat amet. Amet deserunt pariatur officia veniam.',
        'Cillum tempor irure consequat fugiat do eu magna. Sint culpa commodo deserunt veniam incididunt officia mollit. Labore voluptate exercitation cupidatat occaecat.',
        'Dolore labore mollit deserunt sunt ea irure. Adipisicing proident aliqua non commodo reprehenderit ipsum. Reprehenderit eu nulla anim labore.',
        'Ut enim ad minim veniam quis nostrud exercitation. Laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.',
    ][index % 5],
}));

export default data;
