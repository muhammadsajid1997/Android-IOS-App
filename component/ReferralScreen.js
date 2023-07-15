import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const referralData = [
  {
    id: "1",
    name: "John Doe",
    date: "2022-03-15",
    reward: "$100",
    connected: "Pending",
    descriptin: "thank you for joining ",
  },
  {
    id: "2",
    name: "Jane Smith",
    date: "2022-03-20",
    reward: "$20",
    descriptin: "thank you for joining ",
    connected: "Pending",
  },
  {
    id: "3",
    name: "David Lee",
    date: "2022-04-01",
    descriptin: "thank you for joining ",
    reward: "$1503",
    connected: "Done",
  },
  {
    id: "4",
    name: "Sarah Johnson",
    descriptin: "thank you for joining ",
    date: "2022-04-05",
    reward: "$25",
    connected: "Pending",
  },
  {
    id: "5",
    name: "Sarah Johnson",
    descriptin: "thank you for joining , grate to going the app ",
    date: "2022-04-05",
    reward: "$253",
    connected: "Done",
  },
  {
    id: "6",
    name: "Sarah Johnson",
    date: "2022-04-05",
    descriptin: "thank you for joining , grate to going the app ",
    reward: "$2500",
    connected: "Done",
  },
  {
    id: "7",
    name: "John Doe",
    date: "2022-03-15",
    reward: "$100",
    descriptin: "thank you for joining ",
    connected: "Pending",
  },
  {
    id: "8",
    name: "Jane Smith",
    descriptin: "thank you for joining , grate to going the app ",
    date: "2022-03-20",
    reward: "$20",
    connected: "Done",
  },
  {
    id: "9",
    name: "David Lee",
    descriptin: "thank you for joining ",
    date: "2022-04-01",
    reward: "$150",
    connected: "Pending",
  },
];

// secound Time

const ReferralHistoryScreen = () => {
  const navigation = useNavigation();
  //   const renderItem = ({ item }) => (
  //     <View style={styles.itemContainer}>
  //       <View style={styles.avatarContainer}>
  //         {/* <Image source={item.avatar} style={styles.avatar} /> */}
  //         <Text>Image</Text>
  //       </View>
  //       <View style={styles.infoContainer}>
  //         <Text numberOfLines={1} style={styles.name}>
  //           {item.name}
  //         </Text>
  //         <Text numberOfLines={1} style={styles.date}>
  //           {item.date}
  //         </Text>
  //       </View>
  //       <Text numberOfLines={2} style={{ flex: 0.4, fontSize: 15 }}>
  //         {item.descriptin}
  //       </Text>
  //     </View>
  //   );

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ marginLeft: 5 }}>
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name={"arrow-back"} size={25} />
          </TouchableOpacity>
        </View>
        <View style={{ width: "80%", alignItems: "center" }}>
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>
            Token History
          </Text>
        </View>
      </View>

      {/* <TouchableOpacity
        style={{
          margin: 10,
          padding: 15,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#00ff00aa",
          borderRadius: 12,
        }}
        onPress={() => {
          _onPress_getInstallReferrerInfo();
        }}
      >
        <Text style={{ fontSize: 18, color: "#ff00ffcc" }}>
          Get referral Data
        </Text>
      </TouchableOpacity> */}
      {/* <FlatList
        data={referralData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContentContainer}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  list: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatarContainer: {
    padding: 10,
    backgroundColor: "#e6e6e6",
    borderRadius: 50,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  infoContainer: {
    flex: 0.55,
    paddingVertical: 10,
    paddingRight: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: "#666",
  },
});

// Thired time

// const ReferralHistoryScreen = () => {
//   const navigation = useNavigation();
//   const renderItem = ({ item }) => (
//     <View style={styles.itemContainer}>
//       <View
//         style={{
//           flexDirection: "row",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <View style={styles.itemInfo}>
//           <Text numberOfLines={1} style={styles.itemName}>
//             {item.name}
//           </Text>
//           <Text numberOfLines={1} style={styles.itemDate}>
//             {item.date}
//           </Text>
//         </View>
//         <View
//           style={{
//             backgroundColor:
//               item.connected == "Pending" ? "#f1252580" : "#39ec2580",
//             flex: 1,
//             paddingVertical: 6,
//             justifyContent: "center",
//             alignItems: "center",
//             borderRadius: 26,
//           }}
//         >
//           <Text style={{ color: "white", fontSize: 18 }}>{item.connected}</Text>
//         </View>
//         <View style={styles.itemButton}>
//           <Text style={styles.itemRewardText}>{item.reward}</Text>
//         </View>
//       </View>
//       <Text
//         numberOfLines={1}
//         style={{ marginTop: 5, color: "#44444460", fontSize: 12 }}
//       >
//         {item.descriptin}
//       </Text>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View>
//         <TouchableOpacity
//           style={{ marginLeft: 10 }}
//           onPress={() => {
//             navigation.goBack();
//           }}
//         >
//           <Ionicons name={"arrow-back"} size={25} />
//         </TouchableOpacity>
//         <Text style={styles.title}>Referral History</Text>
//       </View>
//       <View
//         style={{
//           backgroundColor: "#fff",
//           borderRadius: 8,
//           paddingVertical: 12,
//           paddingHorizontal: 16,
//           marginBottom: 8,
//           elevation: 5,
//         }}
//       >
//         <Text
//           style={{
//             alignSelf: "center",
//             fontSize: 18,
//           }}
//         >
//           Your invite history
//         </Text>
//         <View
//           style={{
//             justifyContent: "space-around",
//             flexDirection: "row",
//             marginTop: 22,
//             marginBottom: 10,
//           }}
//         >
//           <View style={{ alignItems: "center" }}>
//             <Text style={{ fontWeight: "bold", fontSize: 22 }}>$ 200</Text>
//             <Text>Total Earn</Text>
//           </View>
//           <View style={{ alignItems: "center" }}>
//             <Text style={{ fontWeight: "bold", fontSize: 22 }}>80</Text>
//             <Text>Count's</Text>
//           </View>
//           <View style={{ alignItems: "center" }}>
//             <Text style={{ fontWeight: "bold", fontSize: 22 }}>12</Text>
//             <Text>Pending</Text>
//           </View>
//         </View>
//       </View>
//       <View
//         style={{
//           backgroundColor: "#fff",
//           borderRadius: 8,
//           paddingVertical: 12,
//           paddingHorizontal: 16,
//           marginBottom: 8,
//           elevation: 3,
//           flex: 3,
//         }}
//       >
//         <FlatList
//           data={referralData}
//           showsVerticalScrollIndicator={false}
//           renderItem={renderItem}
//           keyExtractor={(item) => item.id.toString()}
//           style={styles.list}
//         />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     paddingHorizontal: 20,
//     paddingVertical: 20,
//   },
//   itemRewardText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#10b981",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     alignSelf: "center",
//     marginBottom: 30,
//   },
//   list: {
//     flex: 1,
//   },
//   itemContainer: {
//     paddingVertical: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//     flex: 3,
//   },
//   itemInfo: {
//     flex: 1.2,
//     paddingRight: 8,
//   },
//   itemName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   itemDate: {
//     fontSize: 14,
//     color: "#666",
//   },
//   itemButton: {
//     flex: 0.6,
//     alignItems: "center",
//   },
// });

//fouth time

// const ReferralHistoryScreen = () => {
//   const navigation = useNavigation();
//   const renderItem = ({ item }) => {
//     return (
//       <View style={styles.item}>
//         <View style={styles.itemIcon}>
//           <Ionicons name="person-circle-outline" size={32} color="#6b7280" />
//         </View>
//         <View style={styles.itemDetails}>
//           <Text style={styles.itemName}>{item.name}</Text>
//           <Text style={styles.itemDate}>{item.date}</Text>
//         </View>
//         <View style={{ flex: 1, paddingHorizontal: 10 }}>
//           <Text numberOfLines={2} style={{ fontSize: 15 }}>
//             {item.descriptin}
//           </Text>
//         </View>
//         <View style={styles.itemReward}>
//           <Text style={styles.itemRewardText}>{item.reward}</Text>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.headerText}>Referral History</Text>
//       </View>
//       <FlatList
//         data={referralData}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f9fafb",
//     padding: 16,
//   },
//   header: {
//     backgroundColor: "#fff",
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     marginBottom: 16,
//     borderRadius: 8,
//     elevation: 1,
//   },
//   headerText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#374151",
//   },
//   item: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     marginBottom: 8,
//     elevation: 1,
//   },
//   itemIcon: {
//     marginRight: 16,
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#374151",
//   },
//   itemDate: {
//     fontSize: 14,
//     color: "#6b7280",
//   },
//   itemReward: {
//     marginLeft: "auto",
//   },
//   itemRewardText: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#10b981",
//   },
// });

export default ReferralHistoryScreen;
