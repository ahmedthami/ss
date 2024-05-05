import fetch from 'node-fetch';

// AI21 Labs API Key
const apiKey = 'YNYXC98IpEkHvwefedTlaTMHKPHxsb6b';

// Function to generate student advice using AI21 Labs API
async function getStudentAdvice(studentInfo) {
    // Convert student info into a prompt for AI21 Labs' text generation model
    const prompt = `
Given the following student's information (daily update):
Grades: ${studentInfo.grades}
Hobbies: ${studentInfo.hobbies}
Unique Skills: ${studentInfo.unique_skills}
Daily Activity: ${studentInfo.daily_activity}
Professor's Remarks: ${studentInfo.prof_remarks}

Additional Judgement Fields:
Attendance: ${studentInfo.attendance}
Participation: ${studentInfo.participation}
Assignments: ${studentInfo.assignments}
Teamwork: ${studentInfo.teamwork}
Punctuality: ${studentInfo.punctuality}
Focus: ${studentInfo.focus}
Communication: ${studentInfo.communication}
Progress: ${studentInfo.progress}
Problem-solving: ${studentInfo.problem_solving}
Behavior: ${studentInfo.behavior}

Please provide a list of advice on how to deal with this student as a professor.
    `;

    // API endpoint URL for AI21 Labs' text generation
    const apiUrl = 'https://api.ai21.com/studio/v1/j2-mid/complete';

    try {
        // Send the API request
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
                numResults: 1,
                maxTokens: 150, // Adjust as needed
                temperature: 0.7,
                topKReturn: 0,
                topP: 1,
                countPenalty: {
                    scale: 0,
                    applyToNumbers: false,
                    applyToPunctuations: false,
                    applyToStopwords: false,
                    applyToWhitespaces: false,
                    applyToEmojis: false
                },
                frequencyPenalty: {
                    scale: 0,
                    applyToNumbers: false,
                    applyToPunctuations: false,
                    applyToStopwords: false,
                    applyToWhitespaces: false,
                    applyToEmojis: false
                },
                presencePenalty: {
                    scale: 0,
                    applyToNumbers: false,
                    applyToPunctuations: false,
                    applyToStopwords: false,
                    applyToWhitespaces: false,
                    applyToEmojis: false
                },
                stopSequences: ["##"]
            }),
        });

        // Parse the response
        const result = await response.json();

        // Check if there are results in the response
        if (result.completions && result.completions.length > 0) {
            // Extract the advice from the first completion's data
            const advice = result.completions[0].data.text.trim();

            // Return the advice as a list (split by newlines)
            const adviceList = advice.split('\n').filter(line => line.trim() !== '');
            return adviceList;
        } else {
            console.error('No completions found in the response.');
            return [];
        }
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// Example usage with an example studentInfo object
const studentInfo = {
    grades: 'D in Mathematics, C- in English',
    hobbies: 'Playing video games, social media',
    unique_skills: 'Creativity, adaptability',
    daily_activity: 'Absent from classes often, distracted in class',
    prof_remarks: `Struggles to keep up with course material.
                   Frequently absent from classes.
                   Shows lack of focus and motivation in class.
                   Has difficulty completing assignments on time.
                   Needs to work on communication and engagement with peers.
                   Requires extra support to catch up on coursework.`,
    attendance: 'Poor',
    participation: 'Low',
    assignments: 'Incomplete or late submissions',
    teamwork: 'Does not actively engage with peers',
    punctuality: 'Often late',
    focus: 'Easily distracted',
    communication: 'Limited interaction and unclear expression',
    progress: 'Slow improvement',
    problem_solving: 'Needs more guidance and practice',
    behavior: 'Disruptive behavior at times',
};

// getStudentAdvice(studentInfo)
//     .then(advice => {
//         console.log('Advice for the student:');
//         advice.forEach(line => console.log(line));
//     })
//     .catch(error => console.error('Error:', error));

    export async function getStudentRating(studentInfo) {
        // Convert student info into a prompt for AI21 Labs' text generation model
        const prompt = `
    Given the following student's information (daily update):
    Grades: ${studentInfo.grades}
    Hobbies: ${studentInfo.hobbies}
    Unique Skills: ${studentInfo.unique_skills}
    Daily Activity: ${studentInfo.daily_activity}
    Professor's Remarks: ${studentInfo.prof_remarks}
    
    Additional Judgement Fields:
    Attendance: ${studentInfo.attendance}
    Participation: ${studentInfo.participation}
    Assignments: ${studentInfo.assignments}
    Teamwork: ${studentInfo.teamwork}
    Punctuality: ${studentInfo.punctuality}
    Focus: ${studentInfo.focus}
    Communication: ${studentInfo.communication}
    Progress: ${studentInfo.progress}
    Problem-solving: ${studentInfo.problem_solving}
    Behavior: ${studentInfo.behavior}
    
    in one phrase , Give a global overall rating of 1 to 10 of this student in the form of " the rating is x/10"
        `;
    
        // API endpoint URL for AI21 Labs' text generation
        const apiUrl = 'https://api.ai21.com/studio/v1/j2-mid/complete';
    
        try {
            // Send the API request
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    numResults: 1,
                    maxTokens: 150, // Adjust as needed
                    temperature: 0.7,
                    topKReturn: 0,
                    topP: 1,
                    countPenalty: {
                        scale: 0,
                        applyToNumbers: false,
                        applyToPunctuations: false,
                        applyToStopwords: false,
                        applyToWhitespaces: false,
                        applyToEmojis: false
                    },
                    frequencyPenalty: {
                        scale: 0,
                        applyToNumbers: false,
                        applyToPunctuations: false,
                        applyToStopwords: false,
                        applyToWhitespaces: false,
                        applyToEmojis: false
                    },
                    presencePenalty: {
                        scale: 0,
                        applyToNumbers: false,
                        applyToPunctuations: false,
                        applyToStopwords: false,
                        applyToWhitespaces: false,
                        applyToEmojis: false
                    },
                    stopSequences: ["##"]
                }),
            });
    
            // Parse the response
            const result = await response.json();
    
            // Check if there are results in the response
            if (result.completions && result.completions.length > 0) {
                // Extract the advice from the first completion's data
                const advice = result.completions[0].data.text.trim();
                
    
                // Return the advice as a list (split by newlines)
                const adviceList = advice.split('\n').filter(line => line.trim() !== '');
                return adviceList;
                
            } else {
                console.error('No completions found in the response.');
                return [];
            }
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }
    
    // Example usage with an example studentInfo object

    
getStudentRating(studentInfo)
.then(result => {
    const ratingString = result[result.length - 1];
    // Define a regular expression pattern to match the first number in the string
const numberPattern = /\d+/;

// Use the `match()` method to find the first number in the string
const matchResult = ratingString.match(numberPattern);

// Check if a match was found
if (matchResult) {
    // The first number found in the string is the first element of the match result array
    const RATING = parseInt(matchResult[0], 10);
    return RATING;
} else {
    return null;
}
// Here, you could save `studentRating` to a database or use it elsewhere in your application.
})
.catch(error => console.error('Error:', error));

