export const userQuery = {
    user_id: true,
    username: true,
    email: true,
    bio: true,
    readme: true,
    profile_picture: true,
    subscription: {
        select: {
            idsub: true,
            name: true,
            description: true,
        },
    },
}

export const articlesQuery = {
    idart: true,
    idcat: true,
    title: true,
    content: true,
    user_id: true,
    datetime: true,
    category: {
        select: {
            idcat: true,
            name: true,
            description: true,
        },
    },
    author: {
        select: userQuery,
    }
}