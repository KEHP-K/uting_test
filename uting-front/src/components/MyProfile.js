import React, { useEffect, useState } from "react";
import ProfileNoImage from "../img/ProfileNoImage.jpg";
import axios from "axios";
import FormData from "form-data";
const MyProfile = () => {
    const [imgBase64, setImgBase64] = useState("");
    const [imgServerURL, setImgServerURL    ] = useState("");
    const [imgFile, setImgFile] = useState(null);
    const [check, setCheck] = useState(false);
    const [staticpath,setStaticpath]=useState('http://localhost:3001');
    const [ProfileInfo, setProfileInfo] = useState({
        id: "",
        name: "",
        nickname: "",
        gender: "",
        birthday: "",
        email: "",
        univ: "",
        introduce: "",
        mbti: "",
        imgURL: ""
    });

    const [btn, setBtn] = useState("프로필 편집");

    const getMyProfile = async (e) => { // db에서 현재 session에 로근인 되어 있는 사용자에 대한 정보를 가지고 옴
        let sessionUser = sessionStorage.getItem('email');
        let sessionObject = { "sessionUser": sessionUser };

        const res = await axios.post('http://localhost:3001/users/viewMyProfile', sessionObject);

        if(res.data.imgURL!==""){
            setImgBase64(staticpath+res.data.imgURL)
        }
        let data = {
            _id: res.data._id,
            name: res.data.name,
            nickname: res.data.nickname,
            gender: res.data.gender,
            birthday: res.data.birth,
            email: res.data.email,
            imgURL: res.data.imgURL,
            univ: res.data.email.split('@')[1].replace(".ac.kr", "") + "_univ",
            introduce: res.data.introduce,
            mbti: res.data.mbti,
        };
        setProfileInfo(data);
        
    }
    const onClick = async () => {
        if (btn === "프로필 편집") { // 프로필 편집할 수 있도록 활성화
            setBtn("저장");
            setCheck(true);
            var inputs = document.getElementsByClassName('modify');
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].readOnly = false;
            }

        }
        else { // 편집한 프로필을 저장하고, 다시 readOnly
            setBtn("프로필 편집");
            setCheck(false);
            var inputs = document.getElementsByClassName('modify');
            for (var i = 0; i < inputs.length; i++) {
                inputs[i].readOnly = true;
            }

            if (imgFile != null) { //새로 업로드하려는 이미지가 있으면
                let formData = new FormData();

                formData.append('img', imgFile);
                formData.append('currentUser', sessionStorage.getItem("email"));

                let res = await axios.post("http://localhost:3001/users/modifyMyProfileImg", formData);

                ProfileInfo["imgURL"] = res.data.url;
            }
            console.log(ProfileInfo);
            let res = await axios.post('http://localhost:3001/users/modifyMyProfile', ProfileInfo);

        }
    }
    const onChangeImg = async (event) => { // 이미지를 선택했으면
        let reader = new FileReader();

        reader.onloadend = () => {

            const base64 = reader.result;
            if (base64) {
                setImgBase64(base64.toString());
            }
        }
        if (event.target.files[0]) {
            reader.readAsDataURL(event.target.files[0]);
            // 이미지 이름 저장해둠
            setImgFile(event.target.files[0]);
        }
    }

    const onChange = event => {
        setProfileInfo({ ...ProfileInfo, [event.target.name]: event.target.value })
    }

    useEffect(() => {
        getMyProfile();
    }, [])

    return (
        <div name="Profile">
            <div>
                {imgBase64 === "" ?
                    <img style={{ width: "130px", height: "130px" }} src={ProfileNoImage} />
                    :
                    <img style={{ width: "130px", height: "130px" }} src={imgBase64} />}

            </div>
            <div>
                {check === true ? <input type="file" class="profile" accept="image/*" name="imgFile" id="imgFile" onChange={onChangeImg} />
                    : ""}

            </div>
            <div class="name">
                <input
                    type="text"
                    name="name"
                    class="persistent" // 이름은 변경 못 함
                    value={ProfileInfo.name}
                    readOnly />
            </div>
            <div class="nickname">
                <input
                    type="text"
                    name="nickname"
                    class="modify" // 닉네임은 변경 가능
                    value={ProfileInfo.nickname}
                    onChange={onChange}
                    readOnly />
            </div>
            <div class="gender">
                <input
                    type="text"
                    name="gender"
                    class="persistent" // 성별은 변경 못 함
                    value={ProfileInfo.gender}
                    readOnly />
            </div>
            <div class="birthday">
                <input
                    type="text"
                    name="birthday"
                    class="persistent" // 생일은 변경 못 함
                    value={ProfileInfo.birthday}
                    readOnly />
            </div>
            <div class="email">
                <input
                    type="text"
                    name="email"
                    class="persistent" // 이메일은 변경 못 함
                    value={ProfileInfo.email}
                    readOnly />
            </div>
            <div class="univ">
                <input
                    type="text"
                    name="udniv"
                    class="persistent" // 대학은 변경 못 함
                    value={ProfileInfo.univ}
                    readOnly />
            </div>
            <div class="introduce">
                <input
                    type="text"
                    name="introduce"
                    class="modify"
                    value={ProfileInfo.introduce}
                    onChange={onChange}
                    readOnly />
            </div>
            <div class="mbti">
                <input
                    type="text"
                    name="mbti"
                    class="modify"
                    value={ProfileInfo.mbti}
                    onChange={onChange}
                    readOnly />
            </div>
            <button onClick={onClick}>{btn}</button>
        </div>
    )
}
export default MyProfile;