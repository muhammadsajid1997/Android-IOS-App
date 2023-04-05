import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
const MyApps = () => {


  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
       <View style={{ marginTop:50,flexDirection:'row',alignItems:'center'}}>
          <View style={{marginLeft:25}}>
        <Ionicons name="ios-arrow-back-circle-sharp" size={30} color={"#000"} />
        </View>
        <View style={{width:'80%',alignItems:'center'}}>
        <Text style={{fontSize:22,fontWeight:'bold'}}>My Apps</Text>
        </View>
       
        </View>
      <ScrollView style={{ flexGrow: 1 }}>
       
        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ backgroundColor: '#FFFFFF', width: '100%' }}>
            {/* <Text style={{ fontSize: 25, padding: 10, color: '#000000', fontFamily: 'Roboto-Black' }}>All categories</Text>
        <Text style={{ fontSize: 15, paddingLeft: 10, color: '#000000', }}>Curated with the best range of products</Text> */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10, padding: 5 }}>

              <TouchableOpacity style={{ width: '25%', alignItems: 'center' }}>
                <Image source={require('../assets/icons/youtube.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 }}>Youtube</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center' }}>
                <Image source={require('../assets/icons/facebook.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 }}>Facebook</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center' }}>
                <Image source={require('../assets/icons/google.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 }}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center' }}>
                <Image source={require('../assets/icons/gmail.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 }}>Gmail</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/messenger.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 }}>Messenger</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/google-maps.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 }}>Google Maps</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/instagram.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 }}>instagram</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/amazon-pay.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 }}>Amazon</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/tik-tok.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 }}>Tik-Tok</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/whatsapp.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 }}>Whatsapp</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/telegram.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 }}>Telegram</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/snapchat.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 }}>Snapchat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/twitter.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 }}>Twitter</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/discord.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 }}>Discord</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/slack.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 }}>Slack</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/netflix.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 }}>Netflix</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/reddit.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 }}>Reddit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/google-drive.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 }}>Google Drive</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/spotify.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 }}>Spotify</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/outlook.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 ,textAlign:'center'}}>Microsoft Outlook</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/yahoo.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 ,textAlign:'center'}}>Yahoo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/meet.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 ,textAlign:'center'}}>Google Meet</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/notepad.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 ,textAlign:'center'}}>Samsung Notes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/pinterest.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 ,textAlign:'center'}}>Pinterest</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/walmart.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 ,textAlign:'center'}}>Walmart</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/google-photos.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 ,textAlign:'center'}}>Google Photos</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/calculator.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 ,textAlign:'center'}}>Calculator</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/internet.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 ,textAlign:'center'}}>Internet Browser</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/google-calendar.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 ,textAlign:'center'}}>Google Calendar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ width: '25%', alignItems: 'center', marginTop: 15 }}>
                <Image source={require('../assets/icons/clock.png')}
                  style={{ width: 50, height: 50 }}></Image>
                <Text style={{ marginTop: 5 ,textAlign:'center'}}>Clock</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default MyApps;