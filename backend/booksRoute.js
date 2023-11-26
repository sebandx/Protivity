import express from 'express';
import { Book } from '../models/bookModel.js';

const router = express.Router();
// Route for Save a new Book
router.post('/', async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) {
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear',
            });
        }
        const newBook = {
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
            dateAdded: request.body.dateAdded,
        };

        const book = await Book.create(newBook);

        return response.status(201).send(book);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }

});

// Route for Get All Books from database
router.get('/', async (request, response) => {
    try {
        const books = await Book.find({});
        return response.status(200).json({
            count: books.length,
            data: books
        });

    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

// Route for Get One Book from database by id
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const book = await Book.findById(id);
        return response.status(200).json(book);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

// Route for Update a Book
router.put('/:id', async (request, response) => {
    try {
        if (
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
        ) {
            return response.status(400).send({
                message: 'Send all required fields: title, author, publishYear',
            });
        }

        const { id } = request.params;

        const result = await Book.findByIdAndUpdate(id, request.body);
        
        if (!result) {
            return response.status(404).json({message: 'Book not found'});
        }
        return response.status(200).send({message : 'Book updated successfully'});
    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});

    }
});

// Route for Delete a book
router.delete('/:id', async (request, response) => {
    try {
        const {id} = request.params;
        const result = await Book.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({message:'Book not found'});
        }

        return response.status(200).send({message: 'Book deleted successfully'});

    } catch (error) {
        console.log(error.message);
        response.status(500).send({message: error.message});
    }
});

router.post('/duration', async (request, response) => {
    try {
        const { subject } = request.query;

        console.log('Received subject:', subject);


        if (!subject) {
            return response.status(400).send({ message: 'Subject is required' });
        }

        const totalDurations = await Book.aggregate([
            {
                $match: { title: subject } 
            },
            {
                $group: {
                    _id: null, 
                    totalDuration: { $sum: '$publishYear' } 
                }
            },
            {
                $project: {
                    _id: 0,
                    totalDuration: 1 
                }
            }
        ]);

        if (totalDurations.length === 0) {
            return response.status(404).send({ message: 'No tasks found for the given subject' });
        }

        return response.status(200).json(totalDurations[0]);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

router.post('/duration/weekly', async (request, response) => {
    try {
        const { subject } = request.query;

        if (!subject) {
            return response.status(400).send({ message: 'Subject is required' });
        }

        // Get the date a week ago
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const durationsPerDay = await Book.aggregate([
            {
                $match: {
                    title: subject,
                    dateAdded: { $gte: oneWeekAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$dateAdded" } },
                    totalDuration: { $sum: '$publishYear' }
                }
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    totalDuration: 1 
                }
            },
            { $sort: { date: 1 } } // Sort by date in ascending order
        ]);

        if (durationsPerDay.length === 0) {
            return response.status(404).send({ message: 'No data found for the given subject in the past week' });
        }

        return response.status(200).json(durationsPerDay);

    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});




export default router;
