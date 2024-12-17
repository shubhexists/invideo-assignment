defmodule ApiWeb.GeminiController do
  use ApiWeb, :controller

  alias Api.Gemini

  def generate(conn, %{"text" => text}) do
    case Gemini.generate_content(text) do
      {:ok, response} ->
        json(conn, %{data: response})

      {:error, reason} ->
        conn
        |> put_status(:bad_request)
        |> json(%{error: reason})
    end
  end
end
