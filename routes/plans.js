const express = require('express');
const { Plan, PlanTranslation, sequelize } = require('../models');
const router = express.Router();

// Get all plans
router.get('/getAllPlans', async (req, res) => {
  try {
    const plans = await Plan.findAll({
      include: [{ model: PlanTranslation }],
    });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching plans' });
  }
});

router.get('/getPlansByLang', async (req, res) => {
    try {
      const { language } = req.query; // Extract language from query parameters
      const whereCondition = language ? { language } : {}; // Apply filter if language is provided
  
      const plans = await Plan.findAll({
        include: [
          {
            model: PlanTranslation,
            where: whereCondition, // Apply language filter
            required: language ? true : false, // Ensures only matching translations are returned
          },
        ],
      },
    );
 
// console.log(plans)
      res.json(plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      res.status(500).json({ error: 'Error fetching plans' });
    }
  });
  

// Create a new plan
router.post('/CreatePlan', async (req, res) => {
  try {
    const { price, promoPrice, isBestValue, translations } = req.body;

    if (!price || !translations || typeof translations !== 'object') {
      return res.status(400).json({ error: 'Invalid plan data' });
    }

    // Create the Plan
    const plan = await Plan.create({ price, promoPrice, isBestValue });

    // Insert Translations
    const translationEntries = Object.entries(translations).map(([lang, data]) => ({
      planId: plan.id,
      language: lang,
      duration: data.duration,
      features: JSON.stringify(data.features), // Store features as JSON
    }));

    await PlanTranslation.bulkCreate(translationEntries);

    res.status(201).json({ message: 'Plan created successfully', plan });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create plan' });
  }
});

router.post('/bulkCreatePlans', async (req, res) => {
    const { plans } = req.body; // Expect an array of plans
  console.log(plans)
    if (!Array.isArray(plans)) {
      return res.status(400).json({ error: 'Expected an array of plans' });
    }
  
    try {
      // Use a transaction to ensure atomicity
      const result = await sequelize.transaction(async (t) => {
        const createdPlans = [];
  
        for (const planData of plans) {
          const { price, promoPrice, isBestValue, translations } = planData;
  
          // Create the Plan
          const plan = await Plan.create(
            { price, promoPrice, isBestValue },
            { transaction: t }
          );
  
          // Insert Translations
          const translationEntries = Object.entries(translations).map(([lang, data]) => ({
            planId: plan.id,
            language: lang,
            duration: data.duration,
            features: JSON.stringify(data.features), // Store features as JSON
          }));
  
          await PlanTranslation.bulkCreate(translationEntries, { transaction: t });
  
          createdPlans.push(plan);
        }
  
        return createdPlans;
      });
  
      res.status(201).json({ message: 'Plans created successfully', plans: result });
    } catch (error) {
      console.error('Error creating plans:', error);
      res.status(500).json({ error: 'Failed to create plans' });
    }
  });
// Update a plan
router.put('/updatePlan/:id', async (req, res) => {
  const { price, promoPrice, isBestValue, translations } = req.body;
  const { id } = req.params;

  try {
    // Update the Plan
    await Plan.update({ price, promoPrice, isBestValue }, { where: { id } });

    // Update Translations
    for (const [lang, data] of Object.entries(translations)) {
      await PlanTranslation.update(
        { 
          duration: data.duration, 
          features: JSON.stringify(data.features) // Ensure features are stringified
        },
        { where: { planId: id, language: lang } }
      );
    }

    res.json({ message: 'Plan updated successfully' });
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a plan
router.delete('/deletePlan/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Plan.destroy({ where: { id } });
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting plan' });
  }
});

module.exports = router;