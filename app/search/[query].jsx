import { View, Text, SafeAreaView, FlatList,Image,RefreshControl,Alert } from 'react-native'
import React,{useEffect, useState} from 'react'
import SearchInput from '../../components/SerchInput'
import EmptyState from '../../components/EmptyState'
import useAppWrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { SearchPosts } from '../../lib/appwrite'
import { useLocalSearchParams } from 'expo-router'
const Search = () => {
  const {query} = useLocalSearchParams()
  const {data:posts,refetch} = useAppWrite(() => SearchPosts(query))
  

 useEffect(()=>{
  refetch()

 },[query])
  

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
                Search Results
              </Text>
              <Text className="text-2xl font-psemibold text-white">
                {query}
              </Text>

            </View>




          
          </View>
          <SearchInput initialQuery={query}></SearchInput>
          

        </View>
      )}
      ListEmptyComponent={()=>(
        <EmptyState
        title="No videos found"
        subtitle="No video found for this searvh query"
        ></EmptyState>
      )}
      
      />
    </SafeAreaView>
  )
}

export default Search