from flask import Flask, render_template, request, session, jsonify
import os
import json

app = Flask(__name__)
app.secret_key = 'coffeejoint-demo'

# Load Coffee Joint menu data
with open('coffeejoint_menu.json', 'r', encoding='utf-8') as f:
    menu_data = json.load(f)


@app.route('/')
def index():
    return render_template('coffeejoint.html', menu=menu_data)


@app.route('/add_to_cart', methods=['POST'])
def add_to_cart():
    item = request.json
    cart = session.get('cart', [])
    cart.append(item)
    session['cart'] = cart
    return jsonify({"status": "success", "cart": cart})


@app.route('/cart')
def view_cart():
    cart = session.get('cart', [])
    return render_template('cart.html', cart=cart)


@app.route('/submit_order', methods=['POST'])
def submit_order():
    session.pop('cart', None)
    return render_template('thank_you.html')


if __name__ == '__main__':
    print("Running Coffee Joint app on port 8080...")
    app.run(host='0.0.0.0', port=8080)
