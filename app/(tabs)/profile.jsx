import { View, Text, SafeAreaView, FlatList,Image,RefreshControl,Alert, TouchableOpacity } from 'react-native'
import React,{useEffect, useState} from 'react'
import SearchInput from '../../components/SerchInput'
import EmptyState from '../../components/EmptyState'
import useAppWrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { SearchPosts, signOut } from '../../lib/appwrite'
import { useLocalSearchParams } from 'expo-router'
import { GetUserPosts } from '../../lib/appwrite'
import {useGlobalContext} from '../../context/GlobalProvider'
import { icons } from '../../constants'
import InfoBox from '../../components/InfoBox'
import { router } from 'expo-router'

const Profile = () => {
  const {user,setUser,setIsLoggedIn} = useGlobalContext()

  const {data:posts,refetch} = useAppWrite(() => GetUserPosts(user.$id))
   
  const logout = async()=>{
    await signOut();
    setUser(null)
    setIsLoggedIn(false)
    router.replace('/sign-in')

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
        <View className="w-full justify-center items-center mt-6 mb-12 px-4">
          <TouchableOpacity
          className="w-full items-end mb-10"
          onPress={logout}
          >
            <Image source={icons.logout} resizeMode='contain' className="w-6 h-6"></Image>
          </TouchableOpacity>

          <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
            <Image
              source={{uri:user?.avartar}}
              className="w-[90%] h-[90%] rounded-lg"
              resizeMode='cover'
            
            ></Image>

          </View>

          <InfoBox 
          title={user?.username}
          containerStyles='mt-5'
          titleStyles="text-lg"
          />
          <View className="mt-5 flex-row">
            <InfoBox 
            title={posts.length || 0}
            containerStyles='mr-10'
            titleStyles="text-xl"
            subtitle="Posts"
            />
            <InfoBox 
            title="1.2k"
            subtitle='Followers'
            titleStyles="text-xl"
            />

          </View>

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

export default Profile