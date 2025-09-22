include .env

run: build
	@echo "Compilación completada."
	@npm run preview

build: tailwind
	@echo "Compilando pagina."
	@npm run build

upload:
	@echo "Aviso: Instalar sshpass si no lo tienes."
	@sshpass -p '$(VPS_PASSWORD)' scp dist/index.html $(VPS_USER):$(VPS_PATH)
	@sshpass -p '$(VPS_PASSWORD)' scp -r dist/assets/ $(VPS_USER):$(VPS_PATH)

debug: tailwind
	@npm run dev

tailwind:
	@echo "Compilando Tailwind CSS..."
	@npx tailwindcss -i ./input.css -o ./src/assets/css/styles/tailwind.css

init:
	@echo "Instalando dependencias... "
	@npm install