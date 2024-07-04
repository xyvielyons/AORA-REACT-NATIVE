import { View, Text,Image, TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
import { icons } from '../constants'
import { Video,ResizeMode } from 'expo-av'

const VideoCard = ({video:{title,thumbnail,video,creator}}) => {
    const [play, setPlay] = useState(false)
  return (
    <View className="flex-col items-center px-4 mb-14">
        <View className="flex-row gap-3 items-start">
            <View className="justify-center items-center flex-row flex-1">
                <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">

                    <Image
                      source={{uri:creator.avartar}}
                      className="w-full h-full rounded-lg"
                      resizeMode='cover'
                    ></Image>

                </View>

                <View className="justify-center flex-1 ml-3 gap-y-1 ">
               
                        <Text className="text-white font-psemibold text-sm">
                            {title}
                        </Text>
                        <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>
                            {creator.username}
                        </Text>

                  

                </View>

                <View>
                    <Image source={icons.menu} className='w-5 h-5' resizeMode='contain'/>
                </View>

               
            </View>
           


        </View>
               {play ? (
                    <Video
                    source={{uri:video}}
                    className="w-full h-60 rounded-xl mt-3 bg-white/10 "
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    shouldPlay
                    onPlaybackStatusUpdate={(status)=>{
                      if(status.didJustFinish){
                        setPlay(false)
                      }
                    }}
              
                    />
                ):(
                    <TouchableOpacity
                    className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
                    onPress={()=>setPlay(true)}
                    >
                        <Image
                        className="w-full h-full rounded-xl mt-3"
                        source={{uri:thumbnail}}
                        resizeMode='cover'
                        />
                        <Image
                        source={icons.play}
                        className="w-12 h-12 absolute"
                        resizeMode='contain'
                        
                        />
                    </TouchableOpacity>
                )}
       

    </View>
  )
}

export default VideoCard