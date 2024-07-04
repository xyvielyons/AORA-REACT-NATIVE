import { View, Text, SafeAreaView, FlatList,Image,RefreshControl,Alert } from 'react-native'
import React,{useEffect, useState} from 'react'
import {images} from '../../constants'
import SearchInput from '../../components/SerchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import {getAllPosts} from "../../lib/appwrite"
import useAppWrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { getLatestPosts } from '../../lib/appwrite'
import {useGlobalContext} from '../../context/GlobalProvider'
const Home = () => {
  const {data:posts,refetch} = useAppWrite(getAllPosts)
  const {data:latestPosts} = useAppWrite(getLatestPosts)
  const [refreshing,setRefreshing] = useState(false)
  const {user,setUser,setIsLoggedIn} = useGlobalContext()

  const onRefresh = async ()=>{
    setRefreshing(true)
    // re call videos if new videos appered
    await refetch();
    setRefreshing(false)
  }
  

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
      // data={[{id:1},{id:2},{id:3}]}
      data={posts}
      keyExtractor={(item)=>item.$id}
      renderItem={({item})=>(
        <VideoCard video={item}></VideoCard>

      )}
      ListHeaderComponent={()=>(
        <View className="my-6 px-4 space-y-6">
          <View className="justify-between items-start flex-row mb-6">
            <View>
              <Text className="font-pmedium text-sm text-gray-100">
                Welcome Back,
              </Text>
              <Text className="text-2xl font-psemibold text-white">
                {user?.username}
              </Text>

            </View>

            <View className="mt-1.5">
              <Image source={images.logoSmall} className="w-9 h-10" resizeMode='contain'/>
            </View>

          
          </View>
          <SearchInput></SearchInput>
          <View className="w-full flex-1 pt-5 pb-8">
            <Text className="text-gray-100 text-lg font-pregular">Latest Videos</Text>

          </View>
          <Trending posts={latestPosts ?? []}></Trending>

        </View>
      )}
      ListEmptyComponent={()=>(
        <EmptyState
        title="No videos found"
        subtitle="Be the first one to upload a video"
        ></EmptyState>
      )}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      
      />
    </SafeAreaView>
  )
}

export default Home