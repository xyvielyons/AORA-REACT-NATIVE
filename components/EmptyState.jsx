import { View, Text,Image } from 'react-native'
import React from 'react'
import { images } from '../constants'
import CustomButton from './CustomButton'
import {router} from 'expo-router'
const EmptyState = ({title,subtitle}) => {
  return (
    <View className="justify-center items-center px-4">
      <Image
      source={images.empty}
      className="w-[270px] h-[215px]"
      resizeMode='contain'
      ></Image>

            <View>
              <Text className="text-xl font-psemibold text-white mt-2 text-center">
                 {title}
              </Text>
              <Text className="font-pmedium text-sm text-gray-100">
             {subtitle}
              </Text>
              

            </View>

            <CustomButton
            title="Create Video"
            containerStyles="w-full mt-4"
            handlePress={()=>router.push('./create')}
            />
    </View>
  )
}

export default EmptyState