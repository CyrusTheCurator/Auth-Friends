import React, { useState, useEffect } from "react";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import Button from "react-bootstrap/Button";

function Friends(props) {
  const [username, setUsername] = useState(localStorage.getItem("username"));
  const [friends, setFriends] = useState([]);
  const [newFriend, setNewFriend] = useState({});
  const [loadingText, setLoadingText] = useState({
    text: "Loading...",
    class: "loading",
  });
  const logOut = () => {
    localStorage.removeItem("token");
    props.setIsLoggedIn(!props.isLoggedIn);
  };

  const loadingToggler = (res) => {
    if (res.data.length === 0) {
      setLoadingText({
        text:
          "You don't have any friends yet, you can add friends using the form above",
        class: "emptyList",
      });
    } else {
      return null;
    }
  };

  const getData = () => {
    axiosWithAuth()
      .get("https://auth-friends-backend-josh.herokuapp.com/api/friends")
      .then((res) => {
        console.log("data on server response ", res);
        setFriends([...res.data]);
        loadingToggler(res);
      })
      .catch((err) => console.error("error when retrieving frendz ", err));
  };

  const postFriend = () => {
    axiosWithAuth()
      .post(
        "https://auth-friends-backend-josh.herokuapp.com/api/friends",
        newFriend
      )
      .then((res) => {
        setFriends([...res.data]);
        loadingToggler(res);
        console.log(res);
        setNewFriend({
          name: "",
          age: "",
          email: "",
          id: "",
        });
      })
      .catch((err) => console.error("error when posting new frendz ", err));
  };

  const deleteFriend = (delFriend) => {
    axiosWithAuth()
      .delete(
        `https://auth-friends-backend-josh.herokuapp.com/api/friends/${delFriend.id}`
      )
      .then((res) => {
        setFriends([...res.data]);
        loadingToggler(res);
      })
      .catch((err) => console.error("error when posting new frendz ", err));
  };

  useEffect(() => {
    getData();
    setUsername(localStorage.getItem("username"));
  }, []);

  const handleChange = (e) => {
    setNewFriend({ ...newFriend, [e.target.name]: e.target.value });
  };
  let loadingString = "Loading...";
  return (
    <>
      <div className="userArea">
        <Button
          className="hugRight"
          variant="warning"
          onClick={(e) => {
            logOut();
          }}
        >
          SIGN OUT
        </Button>
        Welcome back, {username}
        <br />
        <br />
        Add New Friend <br />
        <br /> Name:{" "}
        <input
          type="text"
          name="name"
          value={newFriend.name}
          onChange={(e) => {
            handleChange(e);
          }}
        />
        Age:{" "}
        <input
          type="text"
          name="age"
          value={newFriend.age}
          onChange={(e) => {
            handleChange(e);
          }}
        />
        Email:{" "}
        <input
          type="text"
          name="email"
          value={newFriend.email}
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <br />
        <Button
          variant="primary"
          onClick={(e) => {
            e.preventDefault();
            postFriend();
          }}
        >
          ADD FRIEND
        </Button>
      </div>
      <br />
      <br />
      Your Friends:
      <br />
      <br />
      <div>
        {friends.length != 0 ? (
          friends.map((friend) => {
            return (
              <div className="friendCard">
                <div> name: {friend.name}</div> <div>age: {friend.age}</div>{" "}
                <div>email: {friend.email}</div>
                <br />
                <Button
                  className="removeFriend"
                  variant="danger"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteFriend(friend);
                  }}
                >
                  Remove Friend
                </Button>
              </div>
            );
          })
        ) : (
          <div className={loadingText.class}>{loadingText.text}</div>
        )}
      </div>
    </>
  );
}
export default Friends;
