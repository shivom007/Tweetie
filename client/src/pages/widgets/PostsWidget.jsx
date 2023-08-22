import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);
  // const name = useSelector((state) => state.user.username)
  // console.log(userId)
 const [UserId,setUserId] = useState(null)
 const loggedInUserId = useSelector((state) => state.user._id);

  // Filter posts based on user ID
  const filteredPosts = isProfile
    ? posts.filter((post) => post.userId === loggedInUserId)
    : posts;
  useEffect(() => {
    if(isProfile) getUserPosts()
    else getPosts()
    setUserId(userId)
  },[isProfile])
  const getPosts = async () => {
    // console.log("inside post ")
    const response = await fetch(`${process.env.REACT_APP_BACKEND}/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const data = await response.json();
    // console.log(data)
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    // console.log("inside post ")
    
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND}/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();

    dispatch(setPosts({ posts: data }));
  };

 
  

  return (
    <>
      {filteredPosts && filteredPosts.length > 0 && filteredPosts.map(
        ({
          _id,
          userId,
          description,
          username,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            username={username}
            description={description}
            UserId={UserId}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
            
          />
        )
      )}
    </>
  );
};

export default PostsWidget;