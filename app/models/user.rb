# == Schema Information
#
# Table name: users
#
#  id                :bigint(8)        not null, primary key
#  email             :string           not null
#  session_token     :string           not null
#  name              :string           not null
#  password_digest   :string           not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  birthday          :datetime
#  gender            :string
#  job               :string
#  relationship_stat :string
#  location          :string
#

class User < ApplicationRecord

  validates :email, :session_token, :name, :password_digest, presence: true
  validates :email, uniqueness: true
  validates :password, length: {minimum: 6, allow_nil: true}
  before_validation :ensure_session_token, :ensure_profile_and_cover

  has_one_attached :profile_picture
  has_one_attached :cover_photo

  has_many :sent_friend_requests, 
    foreign_key: :requester_id, 
    class_name: :FriendRequest

  has_many :received_friend_requests, 
    foreign_key: :requestee_id, 
    class_name: :FriendRequest

  has_many :one_friendships, 
    foreign_key: :user_one_id, 
    class_name: :Friendship

  has_many :two_friendships,  
    foreign_key: :user_two_id, 
    class_name: :Friendship

  has_many :one_friends, 
    through: :two_friendships, 
    source: :user_one

  has_many :two_friends, 
    through: :one_friendships, 
    source: :user_two

  has_many :posted_posts, 
    foreign_key: :poster_id, 
    class_name: :Post

  has_many :received_posts, 
    foreign_key: :postee_id, 
    class_name: :Post

  has_many :comments, 
    foreign_key: :poster_id, 
    class_name: :Comment

  has_many :liked_objects, 
    foreign_key: :user_id, 
    class_name: :Like

  attr_reader :password

  def self.find_by_credentials(email, password) 
    @user = User.find_by(email: email)
    if @user && @user.valid_password?(password)
      @user 
    else 
      nil 
    end
  end  

  def password=(password) 
    @password = password
    self.password_digest = BCrypt::Password.create(password)
  end    

  def valid_password?(password)
    BCrypt::Password.new(self.password_digest).is_password?(password)
  end    

  def reset_session_token 
    self.session_token = SecureRandom.urlsafe_base64(16)
    self.save
    self.session_token
  end 

  def ensure_profile_and_cover 
    unless self.profile_picture.attached? == true
      file = File.open('app/assets/images/default_profile.jpg')
      self.profile_picture.attach(io: file, filename: 'default_profile.jpg')
    end 
    unless self.cover_photo.attached? == true
      file = File.open('app/assets/images/default_cover.png')
      self.cover_photo.attach(io: file, filename: 'default_cover.png')
    end 
  end

  def ensure_session_token 
    self.session_token ||= SecureRandom.urlsafe_base64(16)
  end 

end
