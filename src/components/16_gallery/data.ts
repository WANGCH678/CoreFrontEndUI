export type GalleryImage = {
    id: string;
    thumbnail: string;
    fullsize: string;
};

export type Review = {
    id: string;
    name: string;
    text: string;
    images: GalleryImage[];
};

const names = [
    'Deann', 'Elliot', 'Mabel', 'Noel', 'Alberta',
    'Curtis', 'Leona', 'Eugene', 'Rosalie', 'Simon',
];

const reviews = Array.from({ length: 20 }, (_, reviewIndex): Review => {
    const imageCount = reviewIndex % 5 + 1;
    const images = Array.from({ length: imageCount }, (_, imageIndex) => {
        const imageId = reviewIndex * 5 + imageIndex + 10;
        return {
            id: `${imageId}`,
            thumbnail: `https://picsum.photos/id/${imageId}/150/80`,
            fullsize: `https://picsum.photos/id/${imageId}/600/320`,
        };
    });

    return {
        id: `review-${reviewIndex + 1}`,
        name: names[reviewIndex % names.length],
        text: 'Reprehenderit dolor et aliqua et adipisicing. Quis nisi excepteur veniam dolore.',
        images,
    };
});

export default reviews;
