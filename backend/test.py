from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad

import base64
from fastapi import HTTPException
from typing import Any
# 设置密钥，前端和后端需要一致
SECRET_KEY = base64.b64decode("G8ZyYyZ0Xf5x5f6uZrwf6ft4gD0pniYAkHp/Y6f4Pv4=")  # 从 Base64 解码

BLOCK_SIZE = AES.block_size

def decrypt_data(encrypted_data: str, iv_base64: str) -> str:
    try:
        # 解码 IV 和密文
        iv = base64.b64decode(iv_base64)
        ciphertext = base64.b64decode(encrypted_data)

        # 使用 AES 解密
        cipher = AES.new(SECRET_KEY, AES.MODE_CBC, iv)
        decrypted_data = unpad(cipher.decrypt(ciphertext), BLOCK_SIZE).decode('utf-8')

        return decrypted_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Decryption failed: {str(e)}")


if __name__ == '__main__':
    username="j7XkyPCF+dJACgfXsFJX7w=="
    username_iv='636A5TxzURPtlQ2Ki4Jygg=='
    useriname = decrypt_data(username, username_iv)  # 使用传来的 IV 和密文解密
    print("ss"+useriname)