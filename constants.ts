export const DEFAULT_PROJECT_NAME = 'jovibe-project.html';

export const DEFAULT_SOURCE_DOC = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Jovibe Code Project</title>
  <style>
    body {
      background-color: #282c34;
      color: white;
      font-family: sans-serif;
      text-align: center;
      padding: 2rem;
    }

    .container {
      padding: 2rem;
      border-radius: 8px;
      background-color: #20232a;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    h1 {
      color: #61dafb;
    }

    button {
      background-color: #61dafb;
      border: none;
      padding: 10px 20px;
      color: #20232a;
      font-size: 1rem;
      border-radius: 5px;
      cursor: pointer;
      transition: transform 0.2s;
    }

    button:hover {
        transform: scale(1.05);
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Hello, Jovibe Coder!</h1>
    <p>Start vibing with Jovibe.</p>
    <button id="myButton">Click Me</button>
  </div>

  <script>
    const button = document.getElementById('myButton');

    button.addEventListener('click', () => {
      console.log('Button clicked!');
      alert('You clicked the button! Check the console.');
    });

    // Example of an error for debugging
    // console.error("This is a test error message.");
  </script>
</body>
</html>
`;