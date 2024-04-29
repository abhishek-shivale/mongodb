import { faker } from "@faker-js/faker";
import { MongoClient } from "mongodb";
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
async function seedDB() {
    const uri = "mongodb+srv://abhishekshivale21:niAcNvZX9eNR2mkS@cluster0.m1ovjoj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
    const client = new MongoClient(uri);
    try {
        await client.connect();
        console.log("Connected correctly to server");
        const collection = client.db("iot").collection("kitty-litter-time-series");
        collection.drop();
        let timeSeriesData = [];
        for (let i = 0; i < 5000; i++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            let newDay = {
                timestamp_day: faker.date.past(),
                cat: faker.word.sample(),
                owner: {
                    email: faker.internet.email(),
                    firstName,
                    lastName,
                },
                events: [],
            };
            for (let j = 0; j < randomIntFromInterval(1, 6); j++) {
                let newEvent = {
                    timestamp_event: faker.date.past(),
                    weight: randomIntFromInterval(14, 16),
                };
                newDay.events.push(newEvent);
            }
            timeSeriesData.push(newDay);
        }
        await collection.insertMany(timeSeriesData);
        console.log("Database seeded! :)");
    }
    catch (err) {
        console.log(err);
    }
    finally {
        await client.close();
    }
}
seedDB();
