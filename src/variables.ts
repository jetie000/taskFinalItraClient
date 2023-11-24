import { IUser } from "./types/user.interface";

export const variables = {
    API_URL: 'https://localhost:7066/api',
    PHOTOS_URL: "https://localhost:7066/photos/",
    USER_LOCALSTORAGE: "user_info",
    THEME_LOCALSTORAGE: "page_theme",
    LANGUAGE_LOCALSTORAGE: "page_language",
    MAX_COLLECTION_PHOTO_SIZE: 5000000,
    ASPECT_COLLECTIONS_IMG: 4/3,
    GET_ACCESS_TOKEN: () => (JSON.parse(localStorage.getItem("user_info")!) as IUser)?.accessToken || ''
}