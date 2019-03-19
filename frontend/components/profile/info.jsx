import React from 'react';
import { Link } from 'react-router-dom';
import FinePrint from './fine_print';

class Info extends React.Component {
  constructor(props) {
    super(props)
    this.createFriendsArray = this.createFriendsArray.bind(this)
  }

  verifyProfilePic (userId) {    
    if (this.props.users[userId].profilePicUrl !== undefined) {
      return (<Link className='link' to={`/user/${userId}`}><img className='friend_pic' src={this.props.users[userId].profilePicUrl} alt="friend_image" /></Link>)
    }
  };

  createFriendsArray (key) {
    let correct_user_id;
    if (this.props.friendships[key].user_one_id !== this.props.user.id) {
      correct_user_id = this.props.friendships[key].user_one_id
    } else (
      correct_user_id = this.props.friendships[key].user_two_id
    )
    if (this.props.users[correct_user_id]) {
      return (
        <li key={key} className='friend_window'>
          {this.verifyProfilePic(correct_user_id)}
          <p className='friend_name'>
            {this.props.users[correct_user_id].name}
          </p>
        </li>
      )
    }
  }

  displayFriends () {
    const friends = [];
    let count = 0;
    for (let key in this.props.friendships) {
      count += 1;
      if (count === 10) {
        break;
      }
      friends.push(this.createFriendsArray(key))
    }
    return friends.map((friend) => (friend));
  };

  componentDidMount () {
    this.props.fetchFriends(this.props.user.id).then(
      () => {

        for (let key in this.props.friendships) {
          let correct_user_id;
          if (this.props.friendships[key].user_one_id !== this.props.user.id) {
            correct_user_id = this.props.friendships[key].user_one_id
          } else (
            correct_user_id = this.props.friendships[key].user_two_id
          )
          this.props.fetchUser(correct_user_id)
        }
      }
    )
  }

  componentDidUpdate (oldProps) {
    if (this.props.params.userId != oldProps.params.userId) {
      this.props.fetchFriends(this.props.user.id).then(
        () => {

          for (let key in this.props.friendships) {
            let correct_user_id;
            if (this.props.friendships[key].user_one_id !== this.props.user.id) {
              correct_user_id = this.props.friendships[key].user_one_id
            } else (
              correct_user_id = this.props.friendships[key].user_two_id
            )
            this.props.fetchUser(correct_user_id)
          }
        }
      )
    }
  };

  figureOutMonth(monthNum) {
    switch (monthNum) {
      case 0:
        return 'January';
      case 1:
        return 'February';
      case 2:
        return 'March';
      case 3:
        return 'April';
      case 4:
        return 'May';
      case 5:
        return 'June';
      case 6:
        return 'July';
      case 7:
        return 'August';
      case 8:
        return 'September';
      case 9:
        return 'October';
      case 10:
        return 'November';
      case 11:
        return 'December';
      default:
        break;
    }
  };

  render() {
    if (this.props.user.id === undefined) {
      return (<h1></h1>)
    }
 
    let birthday;
    let job;
    let location;
    let relationship_stat;

    if (this.props.user.birthday) {
      let newDate = new Date(this.props.user.birthday)
     
      birthday = (
        <div className='user_info_item'>
          <div className='birthday_icon'></div>
          <li>Born on {this.figureOutMonth(newDate.getMonth())} {newDate.getDate()}</li>
        </div>
      )
    }

    if (this.props.user.job) {
      job = (
        <div className='user_info_item'>
          <div className='job_icon'></div>
          <li>{this.props.user.job}</li>
        </div>
      )
    } 

    if (this.props.user.location) {
      location = (
        <div className='user_info_item'>
        <div className='location_icon'></div>
        <li>Lives in {this.props.user.location}</li>
      </div>
      )
    }

    if (this.props.user.relationship_stat) {
      relationship_stat = (
      <div className='user_info_item'>
        <div className='relationship_icon'></div>
        <li>{this.props.user.relationship_stat}</li>
      </div>
      )
    }

    return (
      <div className='main_info'>
        <div className='intro'>
          <div className='title'>
            <div className='intro_icon'></div>
            <h3>Intro</h3>
          </div>
          <ul className='custom_info'>
            {birthday}
            {job}
            {location}
            {relationship_stat}
          </ul>
        </div>

        {/* <div className='photos'>
          <div className='title'>
            <div className='photo_icon'></div>
            <h3>Photos</h3>
          </div>
        </div> */}

        <div className='friends'>
          <div className='title'>
            <div className='friends_icon'></div>
            <h3>Friends</h3>
          </div>
          <ul className='grid'>
            {this.displayFriends()}
          </ul>
        </div>

        <div className='answers'>
          <div className='title'>
            <div className='answers_icon'></div>
            <h3>Did You Know <span className='answer_link'>Add Answer</span></h3>
          </div>
        </div>

        <FinePrint />
      </div>
    )
  }
}

export default Info;