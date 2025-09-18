import os
import json
import base64
import openpyxl
import google.generativeai as genai
import re

# ================= CONFIGURAÇÕES =================
GEMINI_API_KEY = "AIzaSyBBUuODOp4EGteYLhtvJ4g_VkcgMMKsAAc"
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

# Cria planilha Excel
wb = openpyxl.Workbook()
ws = wb.active
ws.append(["Arquivo", "Título", "Autores", "Gênero", "Descrição", "Classificação"])

# ================= FUNÇÃO =================
def obter_info_livro(imagem_bytes):
    try:
        # Converte imagem para base64
        imagem_base64 = base64.b64encode(imagem_bytes).decode("utf-8")

        # Conteúdo multimodal (texto + imagem) conforme SDK atual
        content = {
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": (
                                "Você é um bibliotecário escolar. Analise a capa do livro "
                                "e forneça os dados em JSON no formato: "
                                "{'titulo': 'string', 'autores': ['string'], 'genero': 'string', "
                                "'descricao': 'string', 'classificacao': 'Livre | 10 | 12 | 14 | 16 | 18 | Desconhecido'}"
                            )
                        },
                        {
                            "inlineData": {
                                "mimeType": "image/jpeg",
                                "data": imagem_base64
                            }
                        }
                    ]
                }
            ]
        }

        resposta = model.generate_content(content)
        # Extrai JSON da resposta da IA
        match = re.search(r"\{.*\}", resposta.text, re.DOTALL)
        if match:
            dados = json.loads(match.group())
        else:
            raise ValueError("JSON não encontrado na resposta")

        return dados

    except Exception as e:
        print(f"Erro ao processar a imagem: {e}")
        return {
            "titulo": "Não identificado",
            "autores": [],
            "genero": "Não identificado",
            "descricao": "Não identificado",
            "classificacao": "Indefinida"
        }

# ================= LOOP PRINCIPAL =================
pasta_imagens = "imagens"

for arquivo in os.listdir(pasta_imagens):
    if not arquivo.lower().endswith((".jpg", ".jpeg", ".png")):
        continue
    print(f"\n=== 📖 Processando {arquivo} ===")
    try:
        img_path = os.path.join(pasta_imagens, arquivo)
        with open(img_path, "rb") as f:
            imagem_bytes = f.read()

        info = obter_info_livro(imagem_bytes)
        titulo = info.get("titulo", "")
        autores = ", ".join(info.get("autores", []))
        genero = info.get("genero", "")
        descricao = info.get("descricao", "")
        classificacao = info.get("classificacao", "")

        print(f"Título: {titulo}")
        print(f"Autores: {autores}")
        print(f"Gênero: {genero}")
        print(f"Descrição: {descricao}")
        print(f"Classificação: {classificacao}")

        ws.append([arquivo, titulo, autores, genero, descricao, classificacao])
        wb.save("catalogo.xlsx")
        print("💾 Progresso salvo em catalogo.xlsx")

    except Exception as e:
        print(f"Erro ao processar {arquivo}: {e}")
        ws.append([arquivo, "Erro ao processar", "", "", "", ""])
        wb.save("catalogo.xlsx")

print("\n📂 Catálogo completo salvo como catalogo.xlsx")
input("⚡ Pressione ENTER para sair...")