User: {
    id: string,
    name: string,
    login: string,
    password: string,
    access: string,
    photo: blob,
    bdate: date
}

Chat: {
    id: string,
    participants: [Schema.type.User],
    mensagens: Shema.type.Message
}
     
Message: {
     id: string,
     owner: Shema.type.User
     content: string,
     files: [blob],
     chat: Schema.type.Chat
}

Posts: {
    id: string,
    content: string,
    tags: [string],
    owner: Shema.type.User,
    files: [blob],
    likes: [Schema.type.User]
}

Comment: {
    id: string,
    content: string,
    owner: Schema.type.User
    post: Schema.type.Post
    likes: [Schema.type.User]
}