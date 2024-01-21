import os
import json
import sys
from dotenv import load_dotenv

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from openai import OpenAI
# import weaviate
import weaviate
# from langchain.vectorstores import Weaviate
from langchain_community.vectorstores import Weaviate
from utility.env_manager import get_env_manager
from langchain_community.document_loaders import DirectoryLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain.chains.question_answering import load_qa_chain
from langchain_openai import OpenAI
load_dotenv()


env_manager = get_env_manager()
client = OpenAI(api_key=env_manager['openai_keys']['OPENAI_API_KEY'])

def load_data():
    # Load  data
    try:
        loader = DirectoryLoader('prompts', glob="context.txt")
        data = loader.load()
        # Split text into chunks
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
        docs = text_splitter.split_documents(data)
        # Extract text and metadata
        text_meta_pair = [(doc.page_content, doc.metadata) for doc in docs]
        texts, meta = list(zip(*text_meta_pair))

        return texts, meta
    except Exception as error:
        print(f'System error occur in process {error}')

def vectorize_data(texts, meta):
    try:
        # Initialize OpenAI embeddings and Weaviate client
        # embeddings = OpenAIEmbeddings(openai_api_key=env_manager['openai_keys']['OPENAI_API_KEY'])
        auth_config = weaviate.AuthApiKey(api_key=env_manager['vectordb_keys']['VECTORDB_API_KEY'])
        client = weaviate.Client(
            url='https://test-sandbox-g9phsdzq.weaviate.network',
            additional_headers={"X-OpenAI-Api-Key": env_manager['openai_keys']['OPENAI_API_KEY']},
            auth_client_secret=auth_config,
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

def retrieve_context(user_objective):
    try:
        # Load data and vectorize
        texts, meta = load_data()
        vectorstore = vectorize_data(texts, meta)

        # Check if vectorization was successful
        if vectorstore is None:
            return None

        # Perform similarity search
        query = user_objective
        docs = vectorstore.similarity_search(query, k=4)

        # Extract context from similar documents
        context = docs

        return context

    except Exception as e:
        print(f"An error occurred during context generation: {e}")
        return None


def run_qa_chain_with_context(user_objective):
    try:
        # user_objective = str(input("Objective: "))

        # Retrieve context using the previously defined function
        context = retrieve_context(user_objective)

        print("Context:")
        # Load QA chain
        chain = load_qa_chain(
            OpenAI(openai_api_key=env_manager['openai_keys']['OPENAI_API_KEY'], temperature=0),
            chain_type="stuff"
        )

        # Create and return the answer
        return chain.run(input_documents=context, question=user_objective)

    except Exception as e:
        # Handle exceptions, you can customize this part based on your requirements
        print(f"An error occurred: {e}")
        return None

if __name__ == "__main__":
    try:
        result = run_qa_chain_with_context()
        if result is not None:
            print("Answer:", result)
        else:
            print("Failed to retrieve answer.")

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
