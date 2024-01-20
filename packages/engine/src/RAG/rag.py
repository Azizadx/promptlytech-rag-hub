import os
import json
import sys
from dotenv import load_dotenv
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from openai import OpenAI
from math import exp
import numpy as np
import weaviate
from langchain.vectorstores import Weaviate
from langchain.vectorstores import Weaviate
from utility.env_manager import get_env_manager
from langchain.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings.openai import OpenAIEmbeddings
load_dotenv()

env_manager = get_env_manager()
client = OpenAI(api_key=env_manager['openai_keys']['OPENAI_API_KEY'])

def load_data(txts_dir = '../prompts/context.txt'):
    # Load  data
    try:
        loader = TextLoader(txts_dir)
        # Split text into chunks
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
        docs = text_splitter.split_documents(loader)
        # Extract text and metadata
        text_meta_pair = [(doc.page_content, doc.metadata) for doc in docs]
        texts, meta = list(zip(*text_meta_pair))

        return texts, meta
    except Exception as error:
        print(f'System error occur in process {error}')

def vectorize_data(texts, meta):
    try:
        # Initialize OpenAI embeddings and Weaviate client
        embeddings = OpenAIEmbeddings(openai_api_key=env_manager['openai_keys']['OPENAI_API_KEY'])

        client = weaviate.Client(
            url=env_manager['vectordb_keys']['VECTORDB_URL'],
            additional_headers={"X-OpenAI-Api-Key": env_manager['openai_keys']['OPENAI_API_KEY']},
            startup_period=10
        )

        # Define Weaviate schema
        client.schema.delete_all()
        client.schema.get()
        schema = {
            "classes": [
                {
                    "class": "Chatbot",
                    "description": "Documents for chatbot",
                    "vectorizer": "text2vec-openai",
                    "moduleConfig": {"text2vec-openai": {"model": "ada", "type": "text"}},
                    "properties": [
                        {
                            "dataType": ["text"],
                            "description": "The content of the paragraph",
                            "moduleConfig": {
                                "text2vec-openai": {
                                    "skip": False,
                                    "vectorizePropertyName": False,
                                }
                            },
                            "name": "content",
                        },
                    ],
                },
            ]
        }

        # Create Weaviate schema
        client.schema.create(schema)

        # Vectorize and store texts in Weaviate
        vectorstore = Weaviate(client, "Chatbot", "content", attributes=["source"])
        vectorstore.add_texts(texts, meta)

        return vectorstore

    except Exception as e:
        print(f"An error occurred during vectorization: {e}")
        return None

def retrieve_context(user_objective, env_manager):
    try:
        # Load data and vectorize
        texts, meta = load_data()
        vectorstore = vectorize_data(texts, meta, env_manager)

        # Check if vectorization was successful
        if vectorstore is None:
            return None

        # Perform similarity search
        query = user_objective
        docs = vectorstore.similarity_search(query, k=5)

        # Extract context from similar documents
        context = " ".join(doc.page_content for doc in docs)

        return context

    except Exception as e:
        print(f"An error occurred during context generation: {e}")
        return None

if __name__ == "__main__":
    try:
        # Get user objective and print context
        user_objective = str(input("Objective: "))
        context = retrieve_context(user_objective, env_manager)

        if context is not None:
            print("Context:")
            print(context)
        else:
            print("Error occurred during context generation.")

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
