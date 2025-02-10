document.addEventListener("DOMContentLoaded", function () {
    const sendButton = document.getElementById("send-btn");
    const userInputField = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    const botResponses = {
        "hello": "Hi there! How can I assist you today?",
        "kumusta": "Mabuhay! maayos naman ako, ikaw kumusta ka?",
        "ayos lang naman ako": "Mabuti naman iyon",
        "ano ang magagandang puntahan sa pilipinas": "Boracay, Coron Reef, Banaue Rice Terraces, Bulkang Mayon",
        "boracay": "Ang Boracay ay isang tropikal na pulo na matatagpuan sa Kalibo, Aklan. Isa ito sa mga sikat na destinasyon ng mga turista sa bansa. Binubuo ang pulo ng mga barangay ng Manoc-Manoc, Balabag, at Yapak. Dinarayo ito ng napakaraming turista dahil sa napakaganda nitong tanawin at halos kulay puti at pino nitong buhangin.",
        "coron reef": "Palawan Coron reef ay isang kilalang tourist atraksyon sa malaking island getaway bakasyon ng Palawan. Ito ay isang lugar na may maraming potensyal pagdating sa turismo.",
        "banaue rice terraces": "Ang Banaue Rice Terraces ay isang kamangha-manghang tanawin sa Pilipinas na itinuring na 'Eighth Wonder of the World'. Ang mga hagdang-hagdang palayan ay nililok sa gilid ng bundok ng mga ninuno ng mga Ifugao.",
        "bulkang mayon": "Ito ay isang aktibong bulkan sa lalawigan ng Albay, Kilala bilang ang 'Perfect Cone' dahil sa halos 'symmetrical cone shape' nito. Ang bundok ay isang pambansang parke at isang protektadong landscape sa bansa na naproklama bilang Mayon Volcano Natural Park sa taong 2000.",
        "what language is used in this code?": "HTML, Python, CSS, JavaScript.",
        "html": "HTML provides structure to a webpage and makes it accessible.",
        "css": "CSS defines styles, layouts, and responsive designs.",
        "python": "Python is used to translate the words you prompt.",
        "javascript": "JavaScript makes web pages interactive and dynamic.",
        "create a python hello world code": "print('Hello World!')",
        "hi": "Hello! How can I help you?",
        "how are you": "I'm just a bot, but I'm doing great! How about you?",
        "bye": "Goodbye! Have a great day!",
        "thanks": "You're welcome!",
        "default": "I'm not sure how to respond to that. Can you rephrase?"
    };

    function getBotResponse(input) {
        let lowerInput = input.toLowerCase().trim();

        // Match keywords dynamically using includes()
        for (let key in botResponses) {
            if (lowerInput.includes(key)) {
                return botResponses[key];
            }
        }

        return botResponses["default"];
    }

    function typeWriterEffect(element, text, delay = 25) {
        let index = 0;
        function type() {
            if (index < text.length) {
                element.innerHTML += text.charAt(index);
                index++;
                setTimeout(type, delay);
            }
        }
        type();
    }

    function addBotMessage(text) {
        let botMessageElement = document.createElement("div");
        botMessageElement.classList.add("chat-message", "bot-message");
        chatBox.appendChild(botMessageElement);
        typeWriterEffect(botMessageElement, text);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Send automatic message when chat loads
    setTimeout(() => {
        let botMessageElement = document.createElement("div");
        botMessageElement.classList.add("chat-message", "bot-message");
        botMessageElement.innerHTML = "English: Good Day!<br>Filipino: Magandang Buhay!";
        chatBox.appendChild(botMessageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 500);
    
    function sendMessage() {
        let userInput = userInputField.value.trim();
        if (userInput === "") return;

        let userMessage = `<div class="chat-message user-message">${userInput}</div>`;
        chatBox.innerHTML += userMessage;
        userInputField.value = "";

        let botMessageElement = document.createElement("div");
        botMessageElement.classList.add("chat-message", "bot-message");
        chatBox.appendChild(botMessageElement);

        chatBox.scrollTop = chatBox.scrollHeight;

        if (userInput.toLowerCase().includes("translate")) {
            setTimeout(() => {
                fetch("/translate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_input: userInput })
                })
                .then(response => response.json())
                .then(data => {
                    let botText = data.success ? `${data.translated_text} (${data.source_lang} → ${data.dest_lang})` : `Error: ${data.error}`;
                    typeWriterEffect(botMessageElement, botText);
                })
                .catch(error => {
                    console.error("Fetch error:", error);
                    botMessageElement.innerHTML = "Error occurred.";
                });
            }, 1500);
        } else {
            setTimeout(() => {
                let botText = getBotResponse(userInput);
                typeWriterEffect(botMessageElement, botText);
            }, 1500);
        }
    }

    sendButton.addEventListener("click", sendMessage);
    userInputField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});
