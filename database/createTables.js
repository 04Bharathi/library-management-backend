const connection = require("../config/db");

const createUsers = `
    CREATE TABLE IF NOT EXISTS users(
    id INT AUTO_INCREMENT PRIMARY KEY, 
    name VARCHAR(100) NOT NULL, 
    email VARCHAR(100) UNIQUE NOT NULL, 
    password VARCHAR(225) NOT NULL, 
    role ENUM('member', 'librarian'), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createBooks = `
    CREATE TABLE IF NOT EXISTS books(
        id INT AUTO_INCREMENT PRIMARY KEY, 
        title VARCHAR(200) NOT NULL, 
        author VARCHAR(200) NOT NULL, 
        isbn VARCHAR(20) UNIQUE NOT NULL, 
        category VARCHAR(100) NOT NULL, 
        quantity INT NOT NULL, 
        availableQuantity INT NOT NULL, 
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`;

const createBorrowRecords = `
    CREATE TABLE IF NOT EXISTS borrow_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    borrow_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMP NULL,
    status ENUM('borrowed', 'returned') DEFAULT 'borrowed',

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);
`;

connection.query(createUsers, (err) => {
  if (err) throw err;

  connection.query(createBooks, (err) => {
    if (err) throw err;

    connection.query(createBorrowRecords, (err) => {
        if (err) throw err;
    })

    console.log("All tables created");
    connection.end();
  });
});
