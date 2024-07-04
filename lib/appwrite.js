import { Client,Account,ID, Databases,Storage,Avatars, Query } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint:'https://cloud.appwrite.io/v1',
    Platform:'aora',
    projectId:'667191cd001e20a1b77c',
    databaseId:'66859f060038ba5c4e6e',
    userCollectionId:'66859f2f002701a61a9e',
    videoCollectionId:'66859f620029a16b05db',
    storageId:'66719a82003b2efbc680'
}
const {
    endpoint,
    Platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId

} = appwriteConfig
// Init your React Native SDK
const client = new Client();
client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    // .setPlatform(appwriteConfig.Platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);


export const createUser = async(email,password,username)=>{
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )
        if(!newAccount) throw Error

        const avatarUrl = avatars.getInitials(username)

        
        await signIn(email,password)

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId:newAccount.$id,
                email,
                username,
                avartar:avatarUrl
            }
        )

        return newUser
    } catch (error) {
        throw new Error(error)
        
    }
}

export async function signIn(email,password){
    try {
        const session = await account.createEmailPasswordSession(email,password)
        
    } catch (error) {
        throw new Error(error)
        
    }

}

export const getCurrentUser = async ()=>{
    try{
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId',currentAccount.$id)]
        )
       
        if(!currentUser) throw Error;
        return currentUser.documents[0];

    }catch(error){
        console.log(error)

    }
}
export const getFilePreview = async(fileId,type) =>{
    let fileUrl
    try {
        if(type==='video'){
            fileUrl = storage.getFileView(storageId,fileId)

        }else if(type === 'image'){
             fileUrl=storage.getFilePreview(storageId,fileId,2000,2000,'top',100)

        }else {
            throw new Error ('Invalid file type')
        }
        
    } catch (error) {
        throw new Error(error)
        
    }

    if(!fileUrl) throw Error;
    return fileUrl;
}

export const uploadFile = async (file,type) =>{
    if(!file) return;

    const {mimeType,...rest} = file;
    const asset = {
        name:file.fileName,
        type:file.mimeType,
        size:file.fileSize,
        uri:file.uri
    }
   

    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        )
        console.log(uploadedFile)

        const fileUrl = await getFilePreview(uploadedFile.$id,type)

        return fileUrl
    } catch (error) {
        throw new Error(error)
        
    }
}

export const createVideo = async (form) => {
    try {
        const [thumbnailUrl,videoUrl] = await Promise.all([
            uploadFile(form.thumbnail,'image'),
            uploadFile(form.video,'video')
        ])
        console.log(thumbnailUrl,videoUrl)

        const newPost = await databases.createDocument(databaseId,videoCollectionId,ID.unique(),{
            title:form.title,
            thumbnail:thumbnailUrl,
            video:videoUrl,
            prompt:form.prompt,
            creator:form.userId

        })

        return newPost;
    } catch (error) {
        throw new Error(error)
        
    }
}

export const getAllPosts = async()=>{
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId
         
        )    
        return posts.documents;
        
    } catch (error) {
        throw new Error(error)
        
    }

}
export const getLatestPosts = async()=>{
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt',Query.limit(7))]
         
        )    
        return posts.documents;
        
    } catch (error) {
        throw new Error(error)
        
    }

}
export const SearchPosts = async(query)=>{
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title',query)]
         
        )    
        return posts.documents;
        
    } catch (error) {
        throw new Error(error)
        
    }

}
export const GetUserPosts = async(userId)=>{
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator',userId)]
         
        )    
        return posts.documents;
        
    } catch (error) {
        throw new Error(error)
        
    }

}

export const signOut = async ()=>{
    try{
        const session = await account.deleteSession('current')
        return session

    }catch(error){
        throw new Error(error)
    }
}