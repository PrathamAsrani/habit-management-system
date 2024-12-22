import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../layout/Layout';

const RecommendHabit = ({ currentHabits }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API}`;

  // Fetch recommendations and summary
  const fetchRecommendations = async () => {
    setLoading(true);
    setError('');
    try {
        // Merging the habit list into a string
        const habitText = currentHabits.join(", ");
        
        console.log("\nhabitText: ", habitText, "\bcurrentHabits: ", currentHabits);

        const response = await axios.post(
            GEMINI_API_URL,
            {
                contents: [
                    {
                        parts: [
                            {
                                text: habitText ? `Here are some habits: ${habitText}. Please summarize and provide 3 habit recommendations based on these.` : `Please provide any 3 habit recommendations`,
                            },
                        ],
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        // Log the full API response for debugging
        console.log("API Response:", response);

        const generatedText = response?.data?.candidates[0]?.content?.parts[0]?.text;

        if (!generatedText) {
            throw new Error('Invalid response from API: No generated text found.');
        }

        // Check if the response contains "Summary:" and split accordingly
        let recommendationsText = generatedText;
        let summaryText = '';
        
        if (generatedText.includes('Summary:')) {
            const parts = generatedText.split('Summary:');
            recommendationsText = parts[0].trim(); // Everything before the "Summary:" part
            summaryText = parts[1]?.trim(); // Everything after the "Summary:"
        }

        // Parse recommendations from the recommendationsText
        const parsedRecommendations = recommendationsText
            .split('\n')
            .filter((line) => line.trim() !== '')
            .map((line) => {
                const [title, description] = line.split(':');
                if (title && description) {
                    return { title: title.trim(), description: description.trim() };
                }
                return null; // Skip any improperly formatted lines
            })
            .filter(Boolean); // Remove any null entries

        // Set the recommendations state
        setRecommendations(parsedRecommendations);

        // Set the summary state, fallback to default message if no summary
        setSummary(summaryText || '');
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        setError(`Failed to fetch recommendations. ${error.message}`);
    } finally {
        setLoading(false);
    }
};

  return (
    <Layout title='Recommendation -- System'>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Recommended Habits</h2>
      <button
        onClick={fetchRecommendations}
        style={{
          backgroundColor: loading ? '#6c757d' : '#007BFF',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.3s',
        }}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Generate Suggestions'}
      </button>

      {error && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            border: '1px solid #f44336',
            borderRadius: '5px',
            backgroundColor: '#ffe6e6',
            color: '#f44336',
          }}
        >
          <p>{error}</p>
        </div>
      )}

      {/* Only render the summary if it's not empty */}
      {summary && !loading && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <h3>Current Habits Summary</h3>
          <p>{summary}</p>
        </div>
      )}

      {recommendations.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h3>Habit Recommendations</h3>
          {recommendations.map((habit, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #ccc',
                padding: '15px',
                marginBottom: '10px',
                borderRadius: '5px',
                backgroundColor: '#fefefe',
              }}
            >
              <h4>{habit.title}</h4>
              <p>{habit.description}</p>
            </div>
          ))}
        </div>
      )}

      {!loading && !recommendations.length && !error && (
        <p style={{ marginTop: '20px', color: '#666' }}>
          No recommendations yet. Click "Generate Suggestions" to get started!
        </p>
      )}
    </div>
    </Layout>
  );
};

export default RecommendHabit;
