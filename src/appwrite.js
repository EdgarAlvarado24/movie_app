import { Client, Databases, Account ,Query } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject(PROJECT_ID);


const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    // 1. USE APPWRITE SDK TO CHECK IF THE SEACH TERM EXISTS IN DATABASE
    try {
        const response = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', searchTerm)
        ])
        
        // 2. IF IT EXISTS, UPDATE THE COUNT
        if(response.documents.length > 0){
            const doc = response.documents[0];

            await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
                count : doc.count + 1,
            })
        // 3. IF IT DOESN'T EXIST, CREATE A NEW DOCUMENT WITH THE SEARCH TERM AND COUNT AS 1
        }else{
            await database.createDocument(DATABASE_ID, COLLECTION_ID, 'unique()', {
                searchTerm,
                count: 1,
                movie_id: movie.id,
                poster_url : movie.image,
            })
        }

    } catch (error) {
        console.error(error)
    }

    
}

export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.orderDesc('count'),
            Query.limit(5)
        ]);

        return result.documents;
        
    } catch (error) {
        console.error(error)
    }
}