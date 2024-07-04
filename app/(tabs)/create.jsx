import { View, Text, SafeAreaView, ScrollView, TouchableOpacity,Image, Alert } from 'react-native'
import React,{useState} from 'react'
import FormField from '../../components/FormField'
import {Video,ResizeMode} from 'expo-av'
import { icons } from '../../constants'
import CustomButton from '../../components/CustomButton'
import * as DocumentPicker from 'expo-document-picker'
import {router} from 'expo-router'
import {createVideo} from '../../lib/appwrite'
import * as ImagePicker from 'expo-image-picker';

import {useGlobalContext} from '../../context/GlobalProvider'
const Create = () => {
  const {user} = useGlobalContext()
  const [uploading,setUploading] = useState(false)
  const [form, setForm] = useState({
    title:"",
    video:null,
    thumbnail:null,
    prompt:''
  })
  console.log(form)
  const openPicker = async(selectType)=>{
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:selectType ==='image'? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });
    if(!result.cancelled){
      if(selectType === 'image'){
        setForm({...form,thumbnail:result.assets[0]})
      }
      if(selectType === 'video'){
        setForm({...form,video:result.assets[0]})
      }
    }

  }

  const submit = async() =>{
    if(!form.prompt || !form.title || !form.thumbnail || !form.video){
      return Alert.alert('please fill in all the fields')
    }

    setUploading(true)
    try {
      await createVideo({
        ...form,userId:user.$id
      })

      Alert.alert('Success','post uploaded successfully')
      router.push('/home')
      
    } catch (error) {
      Alert.alert('Error',error.message)
      
    }finally{
      setForm({
        title:"",
        video:null,
        thumbnail:null,
        prompt:''
      })
      setUploading(false)
    }
  }
  return (
    <SafeAreaView className="bg-primary h-full">

      <ScrollView className="px-4 my-6 pt-4">
        <Text className="text-2xl text-white font-psemibold">
          Upload Video
        </Text>

        <FormField
        otherStyles="mt-4"
        title="Video Title"
        value={form.title}
        placeholder="Give your video a catchy title .... "
        handleChangeText={(e) => setForm({...form,title:e})}
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">Upload video</Text>
          <TouchableOpacity onPress={() => openPicker('video')}>
            {form.video ? (
              <Video
              source={{uri:form.video.uri}}
              className="w-full h-64 rounded-2xl"
              useNativeControls
              resizeMode={ResizeMode.COVER}
              isLooping
              
              />
            ):(
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image
                  source={icons.upload}
                  resizeMode='contain'
                  className='w-1/2 h-1/2'
                  
                  />

                </View>

              </View>
            )}
          </TouchableOpacity>

        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">Thumbnail Image</Text>
          <TouchableOpacity onPress={() => openPicker('image')}>
            {form.thumbnail ? (
              <Image
              source={{uri:form.thumbnail.uri}}
              className="w-full h-64 rounded-2xl"
             resizeMode='cover'
              
              />
            ):(
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 ">
                  <Image
                  source={icons.upload}
                  resizeMode='contain'
                  className='w-1/2 h-1/2'
                  
                  />
                  <Text className="text-sm text-gray-100 font-pmedium" >Choose a file</Text>


              </View>
            )}
          </TouchableOpacity>


        </View>

        <FormField
        otherStyles="mt-4"
        title="AI Prompt"
        value={form.prompt}
        placeholder="The Prompt you used to create this video"
        handleChangeText={(e) => setForm({...form,prompt:e})}
        />

        <CustomButton
        title="Submit & Publish"
        handlePress={submit}
        containerStyles="mt-7"
        isLoading={uploading}
        ></CustomButton>



      </ScrollView>
    </SafeAreaView>
  )
}

export default Create