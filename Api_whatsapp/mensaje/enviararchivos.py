import requests
import json

url = "https://graph.facebook.com/v18.0/259235733938525/messages"

payload = json.dumps({
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "9931455939",
  "type": "document",
  "document": {
    "link": "https://apps.utel.edu.mx/recursos/files/r161r/w24546w/programacion-logica.pdf",
    "filename": "desde python.pdf"
  }
})
headers = {
  'Authorization': 'Bearer EAAFlhalgZBNQBO2LAmDZAoJAfSh9eJMBor6cYY3h4AEDBRRjAYWXoyl5GCZAGjJ5M28NVdcoJwwWjAPv536RuTkcLYy7ZASJiu4Jd9UzYYEWdHewl7Yvhyk8drdJYoJHZAr3fZAZBT1TPYK1sjWVCQdLntAJUlkzUT63UU5yk6926lWQJr8mZB6TxYxB6ZARwVC5y',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)
