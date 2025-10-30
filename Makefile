include .env

run: build
	@echo "Compilación completada."
	@npm run preview

build: tailwind
	@echo "Compilando pagina."
	@npm run build

upload:
	@echo "Aviso: Instalar sshpass."
	@sshpass -p '$(VPS_PASSWORD)' scp dist/index.html $(VPS_USER):$(VPS_PATH)
	@sshpass -p '$(VPS_PASSWORD)' scp -r dist/assets/ $(VPS_USER):$(VPS_PATH)

debug: tailwind
	@npm run dev

tailwind:
	@echo "Compilando Tailwind CSS..."
	@npx tailwindcss -i ./input.css -o ./src/assets/css/styles/tailwind.css

SRC_IMAGES_DIR = src/assets/images-original/cursos
DEST_IMAGES_DIR = src/assets/images/cursos
SRC_IMAGES = $(wildcard $(SRC_IMAGES_DIR)/*.jpg $(SRC_IMAGES_DIR)/*.jpeg $(SRC_IMAGES_DIR)/*.png $(SRC_IMAGES_DIR)/*.webp)
remove_ext = $(patsubst %.jpg,%,$(patsubst %.jpeg,%,$(patsubst %.png,%,$(patsubst %.webp,%,$1))))
PROCESSED_IMAGES = $(addsuffix .jpg,$(call remove_ext,$(patsubst $(SRC_IMAGES_DIR)/%,$(DEST_IMAGES_DIR)/%,$(SRC_IMAGES))))

image: $(PROCESSED_IMAGES)

#Imagenes PNG:
$(DEST_IMAGES_DIR)/%.jpg: $(SRC_IMAGES_DIR)/%.png
	@mkdir -p $(dir $@)
	@echo "PNG: $< -> $@"
	@magick "$<" -resize 900x450^ -gravity center -crop 900x450+0+0 "$@"

$(DEST_IMAGES_DIR)/%.jpg: $(SRC_IMAGES_DIR)/%.jpg
	@mkdir -p $(dir $@)
	@echo "JPG: $< -> $@"
	@magick "$<" -resize 900x450^ -gravity center -crop 900x450+0+0 "$@"

init:
	@echo "Instalando dependencias... "
	@npm install