import tkinter as tk
from tkinter import filedialog as fd
from PIL import Image, ImageTk, ImageEnhance, ImageFilter,ImageOps
import numpy
import matplotlib.pyplot as plt

window = tk.Tk()
window.geometry("1920x1080")
file_name = None #檔案路徑
load_og = None  #圖片來源（最原始檔案，勿動）
load = None     #圖片來源, Image物件
render = None   #PhotoImage物件
x_begin = tk.IntVar()
x_end = tk.IntVar()
# img: Label物件，可以佈置的標籤
# img_og: Label物件，可以佈置的標籤(最原始的檔案，勿動)

def Open_file():# Opening file
    global img, load_og, load
    file_name = fd.askopenfilename()# 為一個str儲存檔案的路徑
    load_og = Image.open(file_name).convert('L')   #開啟圖片，load為Image物件
    load = Image.open(file_name).convert('L')
    load_og = load_og.resize((300,300))
    load = load.resize((300,300))
    render = ImageTk.PhotoImage(load)   
    img.config(image = render, width = 300, height = 300)   #config: 再次設定此Label的東東
    img.image = render
	
def save_file():#function for saving file
	global load
	f = fd.asksaveasfile(mode = 'wb', filetypes = (("JPG file", "*.jpg"), ("TIF file", "*.tif"), ("All Files", "*.*")))
	if load:
		load.save(f)
def reset_pic():
	load = load_og
	render = ImageTk.PhotoImage(load)
	img.config(image = render)
	img.image = render

# Label區
img = tk.Label(window, width = 300, height = 300)    
img_og = tk.Label(window, width = 300, height = 300)
axis_X = tk.Label(window, font = ('Arial', 18), width = 35, height = 1) #到時候把text重設成圖片的長度


# Button區
btn_open = tk.Button(window, text = 'open', fg='#f00', font = ('Arial', 18), width = 7, height = 1, command = Open_file)
btn_save = tk.Button(window, text = 'save', font = ('Arial', 18), width = 7, height = 1, command = save_file)
btn_reset = tk.Button(window, text = 'reset', font = ('Arial', 18), width = 7, height = 1, command = reset_pic)

# scale區
sca_x_begin = tk.Scale(window, label="Xbegin", orient="horizontal", length=300, from_ = 0, to = 300, variable = x_begin, tickinterval=100, resolution=1)
sca_x_end = tk.Scale(window, label="Xend", orient="horizontal", length=300, from_ = 0, to = 300, variable = x_end, tickinterval=100, resolution=1)

#擺放物件
img.place(x = 150, y = 20)
sca_x_begin.place(x = 150, y = 350)
sca_x_end.place(x = 150, y = 400)
axis_X.place(x = 150, y = 330)
btn_open.place(x = 20, y = 20)
btn_save.place(x = 20, y = 80)
btn_reset.place(x = 20, y = 140)

#形成視窗
window.mainloop()
