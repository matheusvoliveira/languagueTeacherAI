import nathanImg from "./nathan.jpeg";
import logo_teacherAI from "./logo_teacherAI.jpeg"

const Avatar = ({ isGptUser }) => {
  return (
    <div>
      {isGptUser ? (
        <img
          src={nathanImg}
          alt="avatar_nathan_teacher"
          style={{ width: "41px", height: "41px", borderRadius: "50%" }} 
        />
      ) : (
        <img
          src={logo_teacherAI}
          alt="avatar_nathan_teacher"
          style={{ width: "41px", height: "41px", borderRadius: "50%" }} 
        />
      )}
    </div>
  );
};

export default Avatar;
