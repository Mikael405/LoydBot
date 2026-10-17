#!/usr/bin/env python3
"""Assistente para rodar o bot: confere o Node, cria o .env, instala tudo e liga o bot.

Uso:  python iniciar.py      (no Windows)
      python3 iniciar.py     (Linux / Mac)
"""

import shutil
import subprocess
import sys
from pathlib import Path

PASTA = Path(__file__).resolve().parent
ENV = PASTA / ".env"


def erro(msg):
    print(f"\n❌ {msg}")
    sys.exit(1)


def checar_node():
    node, npm = shutil.which("node"), shutil.which("npm")
    if not node or not npm:
        erro("Node.js não encontrado. Instale a versão LTS em https://nodejs.org e tente de novo.")
    versao = subprocess.run([node, "--version"], capture_output=True, text=True).stdout.strip()
    print(f"✅ Node.js encontrado ({versao})")
    try:
        if int(versao.lstrip("v").split(".")[0]) < 18:
            erro("Seu Node.js é antigo. Instale a versão 18 ou mais nova (recomendo a LTS).")
    except ValueError:
        pass
    return node, npm


def criar_env():
    if ENV.exists():
        print("✅ Arquivo .env já existe")
        return

    print("\nVamos configurar o bot (você só faz isso uma vez).")
    token = input("Cole o TOKEN do bot: ").strip()
    if not token:
        erro("O token é obrigatório. Veja no README como pegá-lo.")
    guild = input("ID do seu servidor (opcional, Enter para pular): ").strip()

    ENV.write_text(f"DISCORD_TOKEN={token}\nGUILD_ID={guild}\n", encoding="utf-8")
    print("✅ Arquivo .env criado")


def instalar(npm):
    if (PASTA / "node_modules").exists():
        print("✅ Dependências já instaladas")
        return
    print("\n📦 Instalando dependências (pode levar um minutinho)...")
    if subprocess.run([npm, "install"], cwd=PASTA).returncode != 0:
        erro("Falhou ao instalar as dependências. Veja a mensagem acima.")


def main():
    node, npm = checar_node()
    criar_env()
    instalar(npm)
    print("\n🚀 Ligando o bot... (Ctrl+C para parar)\n")
    try:
        subprocess.run([node, "index.js"], cwd=PASTA)
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
