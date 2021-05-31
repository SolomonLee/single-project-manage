const random_characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+?><|-";

export const randomString = (length: number): string => {
    const result = [];
    for (let i = 0; i < length; i++) {
        result.push(
            random_characters.charAt(
                Math.floor(Math.random() * random_characters.length)
            )
        );
    }
    return result.join("");
};
