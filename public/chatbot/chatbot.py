import random
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import time

app = Flask(__name__)
CORS(app)


genai.configure(api_key='AIzaSyCNLOr85CTB3nyBlg3FViFnkPFTex_uSNU')

class GerarConteudo:
    def __init__(self, entrada):
        self.entrada = entrada
        model = genai.GenerativeModel("gemini-1.5-flash")
        self.response = model.generate_content(
            entrada,
            generation_config=genai.types.GenerationConfig(
                candidate_count=1,
                max_output_tokens=2000,
                temperature=1.0,
            )
        )

    def gerarTexto(self):
        return self.response.text

class InteracaoChatBot():
    def __init__(self):
        self.iteracao = [
            "Olá! Como posso te ajudar hoje?",
            "No que posso ser útil?",
            "Qual o motivo da sua visita?",
            "O que você espera encontrar aqui?",
            "Qual a sua principal dúvida no momento?",
            "Em que posso ser mais útil para o seu progresso hoje?",
            "Você precisa de dicas para melhorar sua produtividade?",
            "Como posso tornar sua experiência mais produtiva?",
            "Tem alguma tarefa que gostaria de revisar ou aprimorar?",
            "Posso ajudar você a planejar uma viagem?",
            "Quer sugestões de atividades para relaxar e reduzir o estresse?",
            "Precisa de dicas para melhorar sua alimentação e estilo de vida?",
            "Posso sugerir ideias para atividades ao ar livre?",
            "Você gostaria de sugestões de filmes ou séries para assistir?",
            "Posso ajudar a planejar seu próximo evento ou reunião?",
            "Precisa de ajuda para encontrar maneiras de melhorar sua concentração?",
            "Quer dicas para melhorar a qualidade do seu sono?",
            "Posso sugerir estratégias para lidar com ansiedade ou nervosismo?",
            "Precisa de ajuda para organizar um ambiente de estudo ou trabalho?",
            "Gostaria de ideias de hobbies novos para experimentar?"
        ]
    
    def mensagem_aleatoria(self):
        return random.choice(self.iteracao)

    def digitar_mensagem(self, mensagem, interval=0.0):
        """Simula a digitação de uma mensagem com um intervalo especificado."""
        texto_digitado = ""
        for letra in mensagem:
            texto_digitado += letra
            # Simula um atraso para o efeito de digitação
            time.sleep(interval)
            # Para a simulação, você pode imprimir ou usar um mecanismo para enviar o texto
            print(texto_digitado)  # Aqui você pode adaptar para retornar o texto na resposta
        return texto_digitado

chatbot_interacao = InteracaoChatBot()

@app.route('/chatbot', methods=['POST'])
def chatbot():
    data = request.get_json()
    user_message = data.get("message")
    response = process_message(user_message)
    return jsonify({"response": response})

def process_message(message):
    if "oi" in message.lower():
        return "Olá! Como posso ajudar você?"
    elif "tchau" in message.lower():
        return "Até mais! Tenha um bom dia!"
    else:
        gerar_conteudo = GerarConteudo(message)
        resposta = gerar_conteudo.gerarTexto()
        return resposta

@app.route('/mensagem_inicial', methods=['GET'])
def mensagem_inicial():
    mensagem = chatbot_interacao.mensagem_aleatoria()
    return jsonify({"response": mensagem})

if __name__ == '__main__':
    app.run(debug=True)
