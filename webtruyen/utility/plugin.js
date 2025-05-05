import {collection, getDocs, query, where} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {db} from "../../firebaseConfig";

const checkAdminRole = async (email) => {
    try {
        const usersRef = collection(db, 'users'); // collection 'users'
        const q = query(usersRef, where('email', '==', email.trim()));
        const querySnapshot = await getDocs(q);

        console.log('Query snapshot:', querySnapshot.docs.map(doc => doc.data()));

        if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            const isAdmin = userData.role === 'admin';
            console.log('Is admin:', isAdmin);
            return isAdmin;
        }
        return false;
    } catch (error) {
        console.error("Lỗi khi kiểm tra quyền admin:", error);
        return false;
    }
};
const isAdmin= async()=>{
    try {
        const userData = await AsyncStorage.getItem('userData');
        console.log('userData==============================',userData)

        if (userData !== null) {
            // Parse dữ liệu JSON nếu cần
            const user = JSON.parse(userData);
            console.log('user.role==="admin',user.role==="admin")
            if(user.role==="admin"){
                return true
            }
            else {
                return false;
            }
        }
    } catch (error) {
        console.error('Lỗi khi lấy userData từ AsyncStorage:', error);
        return null;
    }
}
const isLogin = async()=>{
    try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData !== null) {
                return true
        }
        return null; // Trả về null nếu không có dữ liệu
    } catch (error) {
        console.error('Lỗi khi lấy userData từ AsyncStorage:', error);
        return null;
    }
}
const getCategory=()=>{
    return[
        { "id": 0, "value": "Tất cả" },
        { "id": 1, "value": "Truyện ngắn" },
        { "id": 2, "value": "Truyện hot" },
        { "id": 3, "value": "Truyện dài tập" },
        { "id": 4, "value": "BXH" }
    ]
}
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


export {checkAdminRole, isAdmin, isLogin, getCategory, getRandomInt};