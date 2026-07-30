/**
 * GameUI.tsx — Interface sobreposta do jogo com controles e status
 */

import React from "react";

interface GameUIProps {
  mineCount: number;
  flaggedCount: number;
  gameState: "playing" | "won" | "lost";
  onReset: () => void;
}

export default function GameUI({
  mineCount,
  flaggedCount,
  gameState,
  onReset,
}: GameUIProps) {
  const remainingMines = mineCount - flaggedCount;

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Cabeçalho */}
      <div className="absolute top-0 left-0 right-0 pointer-events-auto bg-gradient-to-b from-black/20 to-transparent p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/manus-storage/logo-magnifying-leaf_a4d40494.png"
                alt="Logo"
                className="w-10 h-10"
              />
              <h1 className="text-3xl font-bold text-amber-900" style={{ fontFamily: "Georgia, serif" }}>
                Exploração Botânica
              </h1>
            </div>
            <button
              onClick={onReset}
              className="px-6 py-2 bg-amber-700 hover:bg-amber-800 text-amber-50 rounded-lg font-serif transition-colors"
            >
              Recomeçar Expedição
            </button>
          </div>

          {/* Status */}
          <div className="mt-4 flex gap-8 text-amber-900">
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif">Ervas Daninhas Restantes:</span>
              <span className="text-2xl font-bold font-serif">{Math.max(0, remainingMines)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-serif">Marcadas:</span>
              <span className="text-2xl font-bold font-serif">{flaggedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Resultado */}
      {gameState !== "playing" && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-auto">
          <div className="bg-amber-50 p-12 rounded-lg shadow-2xl text-center max-w-md">
            {gameState === "won" ? (
              <>
                <h2 className="text-4xl font-bold text-green-700 mb-4" style={{ fontFamily: "Georgia, serif" }}>
                  🌿 Expedição Bem-Sucedida!
                </h2>
                <p className="text-amber-900 text-lg mb-6 font-serif">
                  Você conseguiu evitar todas as ervas daninhas espinhosas e completar sua exploração botânica!
                </p>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-red-700 mb-4" style={{ fontFamily: "Georgia, serif" }}>
                  ⚠️ Expedição Encerrada
                </h2>
                <p className="text-amber-900 text-lg mb-6 font-serif">
                  Você encontrou uma erva daninha espinhosa! A expedição foi interrompida.
                </p>
              </>
            )}
            <button
              onClick={onReset}
              className="px-8 py-3 bg-amber-700 hover:bg-amber-800 text-amber-50 rounded-lg font-serif text-lg transition-colors"
            >
              Iniciar Nova Expedição
            </button>
          </div>
        </div>
      )}

      {/* Instruções */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-auto bg-gradient-to-t from-black/20 to-transparent p-8">
        <div className="max-w-2xl mx-auto text-amber-900 text-sm font-serif">
          <p>
            <strong>Clique esquerdo:</strong> Revelar quadrado | <strong>Clique direito:</strong> Marcar suspeita
          </p>
          <p className="mt-2">
            Números indicam quantas ervas daninhas estão adjacentes. Revele todos os quadrados seguros para vencer!
          </p>
        </div>
      </div>
    </div>
  );
}
