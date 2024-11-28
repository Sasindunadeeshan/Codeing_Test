import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Button, 
  Rate, 
  List, 
  Avatar, 
  Tag, 
  Input, 
  Tooltip, 
  Modal, 
  Progress 
} from 'antd';
import { 
  HeartOutlined, 
  ShareAltOutlined, 
  BookOutlined, 
  StarOutlined,
  EyeOutlined,
  ReadOutlined,
  CheckCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import axios from 'axios';
import '../css/BookDetails.css';

const { TextArea } = Input;

const BookDetails = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ text: '', rating: 0, author: '' });
  const [modalVisible, setModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const [readProgress, setReadProgress] = useState(42);

  // Fetch reviews from backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:5000/reviews');
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };
    fetchReviews();
  }, []);

  // Add or Edit a review
  const handleSaveReview = async () => {
    try {
      if (editMode) {
        const response = await axios.put(`http://localhost:5000/reviews/${editReviewId}`, newReview);
        setReviews(
          reviews.map((review) => 
            review._id === editReviewId ? response.data : review
          )
        );
      } else {
        const response = await axios.post('http://localhost:5000/reviews', newReview);
        setReviews([...reviews, response.data]);
      }

      setNewReview({ text: '', rating: 0, author: '' });
      setModalVisible(false);
      setEditMode(false);
      setEditReviewId(null);
    } catch (error) {
      console.error('Error saving review:', error);
    }
  };

  // Delete a review
  const handleDeleteReview = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/reviews/${id}`);
      setReviews(reviews.filter((review) => review._id !== id));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  // Open modal for editing
  const handleEditReview = (review) => {
    setNewReview(review);
    setEditReviewId(review._id);
    setEditMode(true);
    setModalVisible(true);
  };

  // Book details
  const book = {
    title: 'Bald Bearded Boss',
    author: 'Elliott Holt',
    cover: 'https://www.adobe.com/express/create/cover/media_19d5e212dbe8553614c3a9fbabd4d7f219ab01c85.png?width=750&format=png&optimize=medium',
    rating: 4.5,
    totalRatings: 1234,
    tags: ['Time Travel', 'Fast Paced', 'Debut Writer'],
    description: 'A gripping narrative that blends humor, time travel, and sharp corporate satire. Follow the journey of an unconventional leader navigating the complex world of modern business.',
    publicationDate: 'Feb 2020',
    publisher: 'Random House',
    pageCount: 312,
    genre: 'Contemporary Fiction'
  };

  return (
    <div className="book-details-container">
      <aside className="sidebar">
        <div className="profile-section">
          <Avatar 
            size={64} 
            src="https://via.placeholder.com/64" 
            className="profile-avatar"
          />
          <h2>Sasindu Nadeeshan</h2>
          <p>Book Enthusiast</p>
        </div>
        <nav>
          <ul>
            <li><BookOutlined /> My Library</li>
            <li><StarOutlined /> Recommendations</li>
            <li><EyeOutlined /> Wishlist</li>
            <li><ReadOutlined /> Reading Progress</li>
            <li><CheckCircleOutlined /> Completed</li>
          </ul>
        </nav>
      </aside>

      <main className="content">
        <div className="book-details-grid">
          <div className="book-cover-section">
            <div className="book-cover-wrapper">
              <img src={book.cover} alt={book.title} className="book-cover" />
              <div className="book-cover-actions">
                <Tooltip title="Add to Favorites">
                  <Button shape="circle" icon={<HeartOutlined />} className="cover-action-btn" />
                </Tooltip>
                <Tooltip title="Share">
                  <Button shape="circle" icon={<ShareAltOutlined />} className="cover-action-btn" />
                </Tooltip>
              </div>
            </div>
          </div>

          <div className="book-info-section">
            <h1>{book.title}</h1>
            <h3>By {book.author}</h3>
            
            <div className="book-meta-info">
              <div className="rating-section">
                <Rate disabled defaultValue={book.rating} className="book-rating" />
                <span className="rating-text">
                  {book.rating}/5 ({book.totalRatings} ratings)
                </span>
              </div>

              <div className="book-details-grid">
                <div><strong>Publisher:</strong> {book.publisher}</div>
                <div><strong>Published:</strong> {book.publicationDate}</div>
                <div><strong>Pages:</strong> {book.pageCount}</div>
                <div><strong>Genre:</strong> {book.genre}</div>
              </div>

              <div className="tags">
                {book.tags.map((tag, index) => (
                  <Tag color="geekblue" key={index}>{tag}</Tag>
                ))}
              </div>

              <p className="book-description">{book.description}</p>

              <div className="book-actions">
                <Button type="primary" size="large" icon={<BookOutlined />}>Start Reading</Button>
                <Button type="default" size="large">Preview</Button>
              </div>

              <div className="reading-progress">
                <h4>Reading Progress</h4>
                <Progress 
                  percent={readProgress} 
                  strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
                />
                <div className="progress-details">
                  <span>{readProgress}% Complete</span>
                  <Button type="link" onClick={() => setReadProgress(readProgress + 10)}>Update Progress</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <div className="reviews-header">
            <h2>Community Reviews</h2>
            <Button type="primary" onClick={() => setModalVisible(true)}>Write a Review</Button>
          </div>

          <List
            grid={{ gutter: 16, column: 3 }}
            dataSource={reviews}
            renderItem={(review) => (
              <List.Item>
                <Card 
                  className="review-card" 
                  hoverable
                  actions={[
                    <Tooltip title="Edit">
                      <Button 
                        shape="circle" 
                        icon={<EditOutlined />} 
                        className="edit-review-btn"
                        onClick={() => handleEditReview(review)} 
                      />
                    </Tooltip>,
                    <Tooltip title="Delete">
                      <Button 
                        shape="circle" 
                        icon={<DeleteOutlined />} 
                        className="delete-review-btn"
                        danger 
                        onClick={() => handleDeleteReview(review._id)} 
                      />
                    </Tooltip>
                  ]}
                >
                  <Card.Meta
                    avatar={<Avatar>{review.author ? review.author[0] : 'A'}</Avatar>}
                    title={review.author || 'Anonymous'}
                    description={
                      <>
                        <Rate disabled value={review.rating} />
                        <p>{review.text}</p>
                      </>
                    }
                  />
                </Card>
              </List.Item>
            )}
          />
        </div>

        <Modal
          title={editMode ? "Edit Review" : "Write a Review"}
          open={modalVisible}
          onOk={handleSaveReview}
          onCancel={() => {
            setModalVisible(false);
            setEditMode(false);
            setEditReviewId(null);
            setNewReview({ text: '', rating: 0, author: '' });
          }}
        >
          <Input
            placeholder="Enter your name"
            value={newReview.author}
            onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
            style={{ marginBottom: 16 }}
          />
          <Rate
            onChange={(value) => setNewReview({ ...newReview, rating: value })}
            value={newReview.rating}
            style={{ marginBottom: 16 }}
          />
          <TextArea
            rows={4}
            placeholder="Share your thoughts about the book..."
            value={newReview.text}
            onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
            style={{ marginTop: 16 }}
          />
        </Modal>
      </main>
    </div>
  );
};

export default BookDetails;
