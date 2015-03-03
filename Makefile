PORT=1337
PAGE_WIDTH=21.093333333cm
PAGE_HEIGHT=13.217cm
INPUT=index.html
OUTPUT_NAME=index


all: run

pdf:
	wkhtmltopdf -T 0 -R 0 -B 0 -L 0 --page-width $(PAGE_WIDTH) --page-height $(PAGE_HEIGHT) --print-media-type $(INPUT) $(OUTPUT_NAME).pdf

run:
	python3 server.py $(PORT)
