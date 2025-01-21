import {React, useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const Assistant = () => {
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);

    const handleChange = (event) => {
        setText(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && text.trim() !== '') {
            setMessages((prevMessages) => [...prevMessages, text]);
            setText('');
            event.preventDefault();
        }
    };

    return (
        <div>
            <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
                {messages.length === 0 ? (
                    <p>Chat messages will appear here.</p>
                ) : (
                    messages.map((message, index) => (
                        <Box
                            key={index}
                            sx={{
                                padding: 2,
                                marginBottom: 2,
                                backgroundColor: 'white',
                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                borderRadius: '8px',
                            }}
                        >
                            {message}
                        </Box>
                    ))
                )}
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100vh',
                    marginLeft: 240,
                    overflow: 'hidden',
                }}
            >
                <Box
                    sx={{
                        padding: 2,
                        backgroundColor: 'white',
                        borderTop: '1px solid #ddd',
                    }}
                    style={{
                        position: 'fixed',
                        bottom: 0,
                        left: 240,
                        right: 0,
                    }}
                >
                    <TextField
                        fullWidth
                        className={"myForm"}
                        id="outlined-basic"
                        variant="outlined"
                        value={text}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                    />
                </Box>
            </div>
        </div>
    );
};

export default Assistant