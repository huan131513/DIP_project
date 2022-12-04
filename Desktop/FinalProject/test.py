import tkinter as tk
from tkinter import filedialog as fd
from PIL import Image, ImageTk, ImageEnhance, ImageFilter,ImageOps
import numpy
import matplotlib.pyplot as plt

window = tk.Tk()
window.geometry("1920x1080")
file_name = None #檔案路徑
load_img = None  #img圖片來源（最原始檔案，勿動）
load_PNG = None #png圖片來源（最原始檔案，勿動）
load = None     #圖片來源, Image物件
render = None   #PhotoImage物件
x_begin = tk.IntVar()
x_end = tk.IntVar()
# img: Label物件，可以佈置的標籤
# img_og: Label物件，可以佈置的標籤(最原始的檔案，勿動)

def Open_file():# Opening file
    global img, load_img, load
    file_name = fd.askopenfilename()# 為一個str儲存檔案的路徑
    load_img = Image.open(file_name).convert('L')   #開啟圖片，load為Image物件
    load = Image.open(file_name).convert('L')
    load_img = load_img.resize((300,300))
    load = load.resize((300,300))
    render = ImageTk.PhotoImage(load)   
    img.config(image = render, width = 300, height = 300)   #config: 再次設定此Label的東東
    img.image = render

def Open_PNG():
    global img_PNG, load_PNG
    file_name = fd.askopenfilename()    # 為一個str儲存檔案的路徑
    load_PNG = Image.open(file_name)    # 開啟圖片，load為Image物件
    load_PNG = load.resize((300,300))
    render = ImageTk.PhotoImage(load)   
    img.config(image = render, width = 300, height = 300)   #config: 再次設定此Label的東東
    img.image = render

def get_PNG():
    global img, load_img, load
    pass
# Label區
img = tk.Label(window, width = 300, height = 300)
img_PNG = tk.Label(window, width = 300, height = 300)     


# Button區
btn_open = tk.Button(window, text = 'open', fg='#f00', bg="red", font = ('Arial', 18), width = 7, height = 1, command = Open_file)
btn_open_PNG = tk.Button(window, text = 'openPNG', fg='#f00', font = ('Arial', 18), width = 7, height = 1, command = Open_PNG)

#擺放物件
img.place(x = 150, y = 20)
btn_open.place(x = 20, y = 20)


#形成視窗
window.mainloop()
