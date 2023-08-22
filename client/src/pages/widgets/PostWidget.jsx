import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  DeleteOutlineOutlined,
  CheckOutlined,
  CancelOutlined,
  EditOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "componets/FlexBetween";
import Friend from "componets/Friend";
import WidgetWrapper from "componets/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setPosts } from "state";

const PostWidget = ({
  postId,
  postUserId,
  UserId,
  description,
  username,
  picturePath,
  userPicturePath,
  likes,
  comments,

}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  // const name = useSelector((state) => state.user.username)
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;
  const handleEditClick = () => {
    setIsEditing(true);
  };
  const checkUser = UserId === postUserId;
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedDescription(description);
  };
  const patchLike = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND}/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    // console.log(updatedPost)
    dispatch(setPost({ post: updatedPost }));
  };

  const handleSaveEdit = async () => {
    // Call API to save the edited description
    const response = await fetch(`${process.env.REACT_APP_BACKEND}/posts/${postId}/edit`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: editedDescription,
        userId: loggedInUserId,
      }),
    });
    setIsEditing(false);
    const updatedPost = await response.json();

    dispatch(setPost({ post: updatedPost }));
  };

  const postDel = async () => {
    const response = await fetch(`${process.env.REACT_APP_BACKEND}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPosts({ posts: updatedPost }));
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={username}
        userPicturePath={userPicturePath}
      />
      {isEditing && checkUser ? (
        <textarea
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          rows={2}
          style={{
            width: "100%",
            borderRadius: "0.75rem",
            marginTop: "0.75rem",
          }}
        />
      ) : (
        <Typography color={main} sx={{ mt: "1rem" }}>
          {description}
        </Typography>
      )}
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={picturePath}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>
        <FlexBetween>
          {isEditing && checkUser ? (
            <>
              <IconButton onClick={handleSaveEdit}>
                <CheckOutlined />
              </IconButton>
              <IconButton onClick={handleCancelEdit}>
                <CancelOutlined />
              </IconButton>
            </>
          ) : (
            ""
          )}
          {checkUser && !isEditing ? (
            <IconButton onClick={handleEditClick}>
              <EditOutlined />
            </IconButton>
          ) : (
            ""
          )}
          {checkUser ? (
            <IconButton onClick={postDel}>
              <DeleteOutlineOutlined />
            </IconButton>
          ) : (
            ""
          )}
          <IconButton>
            <ShareOutlined />
          </IconButton>
        </FlexBetween>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={i}>
              <Divider />
              <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
